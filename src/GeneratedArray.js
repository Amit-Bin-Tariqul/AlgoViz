export const generateRandomArray = () => {
    const randomArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    localStorage.setItem('randomArray', JSON.stringify(randomArray));
    return randomArray;
  };
  