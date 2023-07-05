import { Selection } from '../@interfaces/interfaces';

const url = process.env.REACT_APP_API_URL;

export const fetchRandomSequence = async (token: string) => {
  try {
    const response = await fetch(`${url}sequence/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.log('error occured: ', error);
  }
};

export const sendMarkedSequence = async (
  selections: Selection[],
  sequence_name: string,
  frame_00: string,
  token: string,
  user: { user_id: number; username: string }
) => {
  try {
    const response = await fetch(`${url}sequence/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ selections, sequence_name, user, frame_00 }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log(selections, token, sequence_name);
      throw new Error('wrong format');
    }
  } catch (error: any) {
    console.log('error occured: ', error);
  }
};

export const getUserMarkedSequences = async (
  token: string,
  user: { user_id: number; username: string }
) => {
  try {
    const response = await fetch(`${url}sequence/${user.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ user }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error('Error occured');
    }
  } catch (error: any) {
    console.log('error occured: ', error);
  }
};

//admin dashboard
export const adminGetUserList = () => {};

export const adminGetUserMarkedSequences = () => {};
