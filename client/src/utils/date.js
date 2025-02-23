export const convertDate = (input) => {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString(); 
    const year = date.getFullYear();
    return { formattedDate, year };
  };