import styled from "styled-components";

export const Border = styled.div`
  border: 1px solid black;
  border-radius: 3px;
`;

export const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  border: 2px solid black;
  border-radius: 3px;
`;

export const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid black;
  border-radius: 3px;
`;

export const CardBox = styled.span`
  border: 1px solid ${props => props.color || 'black'};
  color: ${props => props.color || 'black'};
  margin: 1em;
  padding: 0.5em 0.25em;
  border-radius: 3px;
`;

export const List = styled.ul`
  list-style: none;
`
export const Container = styled.div`
  width: auto;
  margin: 30px;
`;

export const Title = styled.h1`
  text-align: center;
`;

export const Row = styled.div`
  display: table;
  margin: 1em 0em;
`;

export const Column = styled.div`
  display: table-cell;
`;
