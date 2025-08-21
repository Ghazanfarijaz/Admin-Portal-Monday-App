import { AttentionBox, Button, Flex, Text } from "@vibe/core";
import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();
monday.setApiVersion("2023-10");

// Check the allowed users count for each plan
const checkAllowedUsersCount = ({ planId, users_count }) => {
  if (planId === "Starter" && users_count > 3) {
    return false;
  } else if (planId === "Basic" && users_count > 10) {
    return false;
  } else if (planId === "Standard" && users_count > 30) {
    return false;
  } else if (planId === "Pro" && users_count > 100) {
    return false;
  } else if (planId === "Enterprise" && users_count > 300) {
    return false;
  }
  return true;
};

// Map of allowed users in each plan
// This is used to display the error message when the user count exceeds the allowed limit
const allowedUsersInPlanMap = new Map([
  ["Starter", 3],
  ["Basic", 10],
  ["Standard", 30],
  ["Pro", 100],
  ["Enterprise", 300],
]);

// Function to get the subscription status
const getSubscriptionStatus = (setSubscriptionInfo) => {
  monday
    .api(
      `query {
        apps_monetization_status {
          is_supported
        }
        app_subscription {
          plan_id
          renewal_date
          billing_period
          days_left
          is_trial
        }
    }`
    )
    .then(async (res) => {
      const data = res.data;
      const subscription = data?.app_subscription[0] || false;

      let subscriptionStatus = false;
      let errorMessage = "";

      // if (fullAccessAccountIds.includes(String(data.account.id))) {
      //   subscriptionStatus = "whitelisted";
      // }

      if (!subscriptionStatus && !data.apps_monetization_status.is_supported) {
        subscriptionStatus = "not-supported";
        console.info(
          "App monetization is not supported, allowing all features"
        );
      }
      if (!subscriptionStatus && !subscription) {
        subscriptionStatus = "no-subscription";
      }
      if (!subscriptionStatus && subscription.is_trial) {
        subscriptionStatus = "trial";
      }
      if (!subscriptionStatus && subscription.days_left <= 0) {
        subscriptionStatus = "expired";
      }
      if (!subscriptionStatus) {
        // Fetch the User Count from the Backend

        const isPlanValid = checkAllowedUsersCount({
          planId: subscription.plan_id,
          users_count: 10,
        });

        if (!isPlanValid) {
          subscriptionStatus = "plan-limit";
          errorMessage = `You have reached the maximum number of items (${allowedUsersInPlanMap.get(
            subscription.plan_id
          )}) allowed in your plan (${
            subscription.plan_id
          }). Upgrade your plan to continue using the app.`;
        }
      }
      if (!subscriptionStatus) {
        subscriptionStatus = "valid";
      }
      setSubscriptionInfo({
        status: subscriptionStatus,
        message: errorMessage,
      });
      if (
        ["valid", "valid-assumed", "whitelisted", "trial"].includes(
          subscriptionStatus
        )
      ) {
        console.log("App Opened");
      }
    })
    .catch((err) => {
      console.error(err);
      setSubscriptionInfo({ status: "error" });
    });
};

// Function to parse the JWT payload
const parseJwtPayload = (jwtToken) => {
  try {
    const payloadBase64 = jwtToken.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

/*
  Components
  These components are used to display the subscription
  status messages based on the subscription status.
*/

// NoSubscription Component
const NoSubscription = ({ message }) => {
  return (
    <div className="warning">
      <AttentionBox
        type={AttentionBox.types.WARNING}
        title={
          message ||
          "Please set up your subscription to continue using this app."
        }
        text={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            alignItems: "center",
            marginTop: 20,
            maxWidth: "538.78px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p>
            You are not subscribed to any plan. You would need to purchase a
            suitable plan to use the app.
          </p>
          <Button
            onClick={() =>
              monday.execute("openPlanSelection", { isInPlanSelection: true })
            }
          >
            Purchase Plan
          </Button>
        </div>
      </AttentionBox>
    </div>
  );
};

// InvalidSubscription Component
const InvalidSubscription = ({ message }) => {
  return (
    <div className="warning">
      <AttentionBox
        type={AttentionBox.types.WARNING}
        title="Please select a suitable subscription to continue using this app"
        text={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            alignItems: "center",
            marginTop: 20,
            maxWidth: "538.78px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p>{message || ""}</p>
          <Button
            onClick={() =>
              monday.execute("openPlanSelection", { isInPlanSelection: false })
            }
          >
            View billing info
          </Button>
        </div>
      </AttentionBox>
    </div>
  );
};

// PlanLimitReached Component
const PlanLimitReachedSubscription = ({ message }) => {
  return (
    <div className="warning">
      <AttentionBox
        type={AttentionBox.types.WARNING}
        title="Please select a suitable subscription to continue using this app"
        text={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            alignItems: "center",
            marginTop: 20,
            maxWidth: "538.78px",
            textAlign: "center",
          }}
        >
          <p>{message || ""}</p>
          <Button
            onClick={() =>
              monday.execute("openPlanSelection", { isInPlanSelection: false })
            }
          >
            View billing info
          </Button>
        </div>
      </AttentionBox>
    </div>
  );
};

// ViewOnlyUser Component
const ViewOnlyUser = () => {
  return (
    <div className="warning">
      <AttentionBox
        type={AttentionBox.types.WARNING}
        title="Sorry, This view is not available for view only users"
      ></AttentionBox>
    </div>
  );
};

// SubscriptionMessageContainer Component
const SubscriptionMessageContainer = ({ children }) => (
  <Flex
    align="Center"
    justify="Center"
    style={{ height: "100vh", width: "100vw" }}
  >
    {children}
  </Flex>
);

// SubscriptionProvider Component
// This component checks the subscription status and renders the appropriate message based on the status
const SubscriptionProvider = ({ children }) => {
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [subscriptionInfo, setSubscriptionInfo] = useState({
    status: "loading",
    message: "",
  });

  useEffect(() => {
    monday.listen("sessionToken", (res) => {
      const payload = parseJwtPayload(res.data);
      // console.info("sessionToken payload -> ", payload);
      if (payload.dat.is_view_only) {
        // A view only user cannot access the monday GQL API,
        // so we can't check their subscription status etc,
        // so we just disable the app for them
        console.info("View only user detected, disabling app");
        return setIsViewOnly(true);
      } else {
        monday.listen("context", (res) => {
          getSubscriptionStatus(setSubscriptionInfo);
        });
      }
    });
  }, []);

  if (isViewOnly) {
    return (
      <SubscriptionMessageContainer>
        <ViewOnlyUser />
      </SubscriptionMessageContainer>
    );
  }

  if (subscriptionInfo.status === "loading") {
    // Not really anything we can return here, since according to the
    // style guide loading spinners should only be used in more specific contexts
    return (
      <SubscriptionMessageContainer>
        <Text>Loading...</Text>
      </SubscriptionMessageContainer>
    );
  }

  if (["no-subscription"].includes(subscriptionInfo.status)) {
    return (
      <SubscriptionMessageContainer>
        <NoSubscription />
      </SubscriptionMessageContainer>
    );
  }

  if (["invalid-subscription", "expired"].includes(subscriptionInfo.status)) {
    return (
      <SubscriptionMessageContainer>
        <InvalidSubscription message={subscriptionInfo.message} />
      </SubscriptionMessageContainer>
    );
  }

  if (["plan-limit"].includes(subscriptionInfo.status)) {
    return (
      <SubscriptionMessageContainer>
        <PlanLimitReachedSubscription message={subscriptionInfo.message} />
      </SubscriptionMessageContainer>
    );
  }

  return <div className={subscriptionInfo.status}>{children}</div>;
};

export default SubscriptionProvider;
