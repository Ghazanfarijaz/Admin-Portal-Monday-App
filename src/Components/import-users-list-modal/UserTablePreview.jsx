import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@vibe/core";

const UserTablePreview = ({ users = [], onRemove }) => {
  const columns = [
    {
      id: "name",
      title: "Name",
      loadingStateType: "long-text",
    },
    {
      id: "email",
      title: "Email",
      loadingStateType: "long-text",
    },
    {
      id: "password",
      title: "Password",
      loadingStateType: "medium-text",
    },
    {
      id: "action",
      title: "Action",
      width: 100,
      loadingStateType: "circle",
    },
  ];

  return (
    <Table
      emptyState={<h1 style={{ textAlign: "center" }}>No Users Found</h1>}
      columns={columns}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableHeaderCell key={column.id} title={column.title} />
        ))}
      </TableHeader>
      <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow key={idx}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>
                <Button
                  kind="tertiary"
                  size="small"
                  onClick={() => onRemove(idx)}
                  className="flex w-full"
                >
                  <span className="text-sm text-right">❌</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </div>
    </Table>
  );
};

export default UserTablePreview;
