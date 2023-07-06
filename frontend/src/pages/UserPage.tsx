import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getUserMarkedSequences } from '../networking/sequenceControllerNetwork';
import Button from '../components/Button';

const options = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

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
  const [links, setLinks] = useState({ prevLink: null, nextLink: null });
  const [items, setItems] = useState([]);

  const fetchUserMarkedSequences = useCallback(
    async (token: string, user: { user_id: number; username: string }) => {
      const response = await getUserMarkedSequences(token, user);
      const nextLink = response.next;
      const prevLink = response.prev;
      setLinks({ prevLink, nextLink });
      const data = response.results;

      setItems(data);
    },
    []
  );

  useEffect(() => {
    fetchUserMarkedSequences(token, user);
  }, [token, user, fetchUserMarkedSequences]);

  return (
    <Wrapper>
      User: {user.username}
      <div className="links">
        {items.map((item, i: number) => {
          console.log(item);
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
    </Wrapper>
  );
}

export default UserPage;
