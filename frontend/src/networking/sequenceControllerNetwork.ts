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
  user: { user_id: number; username: string },
  images: {
    sequenceName: string;
    images: { imageName: string; image: string }[];
  }
) => {
  for (let i = 0; i < images.images.length; i++) {
    let mark = 0;
    selections.forEach((item: Selection) => {
      if (item.imageId === i) mark++;
    });
    if (!mark)
      selections.splice(i, 0, {
        imageId: i,
        selection: { selectionId: 0, edges: [] },
      });
  }

  try {
    const response = await fetch(`${url}sequence/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        selections,
        sequence_name,
        user,
        frame_00,
        length: images.images.length,
      }),
    });
    if (response.ok) {
      //const data = await response.json();
    } else {
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
    const response = await fetch(`${url}sequence/${user.username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error occured');
    }
  } catch (error: any) {
    console.log('error occured: ', error);
  }
};

export const getSequenceById = async (token: string, sequenceId: number) => {
  try {
    const response = await fetch(`${url}sequence/${sequenceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw new Error('Error occured');
    }
  } catch (error: any) {
    console.log('error occured: ', error);
  }
};

export const getSequenceImagesByNameAndFrame = async (
  token: string,
  seqName: string,
  frame_00: string
) => {
  try {
    const response = await fetch(`${url}sequence/${seqName}/${frame_00}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
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
