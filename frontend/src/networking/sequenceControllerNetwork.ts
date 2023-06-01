import { Selection } from '../@interfaces/interfaces';

const url = 'http://127.0.0.1:8000/api/';

export const fetchRandomSequence = () => {
  //get random sequence, return it
};

export const sendMarkedSequence = async (
  selections: Selection[],
  token: string
) => {
  try {
    const response = await fetch(`${url}sequence/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ selections }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error('wrong format');
    }
  } catch (error: any) {
    console.log('error occured: ', error);
  }
};

//admin dashboard
export const adminGetUserList = () => {};

export const adminGetUserMarkedSequences = () => {};
