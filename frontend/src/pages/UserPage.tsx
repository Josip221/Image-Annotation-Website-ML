import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getUserMarkedSequences } from '../networking/sequenceControllerNetwork';
import Button from '../components/Button';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 1em;

  .links {
    display: flex;
    flex-direction: column;
    margin: 4em;

    gap: 0.5em;
  }

  .buttons {
    display: flex;
    flex-direction: row;
  }

  .link {
    display: flex;
    border: 2px ${props => props.theme.colors.second} solid;
    flex-direction: column;
    padding: 1em;
    font-size: 1rem;
    gap: 0.5em;
    text-decoration: none;
    color: ${props => props.theme.colors.text};
  }
`;

function UserPage() {
  const { token, user } = useAuth() as authContextProps;
  const { username } = useParams();
  const [links, setLinks] = useState({ prevLink: '', nextLink: '' });
  const [items, setItems] = useState([]);

  const fetchUserMarkedSequences = useCallback(
    async (
      token: string,
      user: { user_id: number; username: string },
      page = ''
    ) => {
      const response = await getUserMarkedSequences(token, user, page);
      const nextLink = response.next;
      const prevLink = response.previous;
      setLinks({ prevLink, nextLink });
      const data = response.results;
      setItems(data);
    },
    []
  );
  const nextButtonClick = () => {
    const pageIndex = links.nextLink.split('?page=')[1];
    console.log(pageIndex);
    fetchUserMarkedSequences(token, user, `?page=${pageIndex}`);
  };
  const prevButtonClick = () => {
    const pageIndex = links.prevLink.split('?page=')[1];
    if (pageIndex) {
      fetchUserMarkedSequences(token, user, `?page=${pageIndex}`);
    } else {
      fetchUserMarkedSequences(token, user);
    }
  };

  useEffect(() => {
    fetchUserMarkedSequences(token, user);
  }, [token, user, fetchUserMarkedSequences]);

  return (
    <Wrapper>
      User: {user.username}
      <div className="links">
        {items.map((item, i: number) => {
          const { id, sequence_name, reviewed_at, frame_00 } = item;
          const frame: string = frame_00;
          const dateTimeObj = new Date(reviewed_at);
          const formatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const formattedDateTime = formatter.format(dateTimeObj);
          return (
            <Link className="link" key={i} to={`/sequence/${id}`}>
              <span> Id: {id}</span>
              <span> Name: {sequence_name}</span>
              <span> Image: {frame.split('-')[0]}</span>
              <span> Marked: {formattedDateTime}</span>
            </Link>
          );
        })}
      </div>
      <div className="buttons">
        {links.prevLink && (
          <Button parentFunction={prevButtonClick}>Prev</Button>
        )}
        {links.nextLink && (
          <Button parentFunction={nextButtonClick}>Next</Button>
        )}
      </div>
    </Wrapper>
  );
}

export default UserPage;
