import { Loader } from "@mantine/core";

const LoadingBackdrop = () => {
  return (
    <div
      className={`h-screen w-screen absolute top-0 left-0 z-[1300] flex justify-center items-center bg-white/30 backdrop-blur-sm`}
    >
      <Loader color="#007F9B" size="md" type="bars" />
    </div>
  );
};

export default LoadingBackdrop;
