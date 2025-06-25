const CustomizationData = {
  getAllBoards: async ({ monday }) => {
    const query = `
      query {
        boards {
          name
          id
          columns {
            id
            title
          }
        }
      }
    `;
    const response = await monday.api(query);
    return response.data.boards;
  },
};

export default CustomizationData;
