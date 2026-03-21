"use client";

import styled from "styled-components";

const Container = styled.nav`
  z-index: 1100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid mediumseagreen;
  border-radius: 50%;
`;

export default function TopNav() {
  return (
    <Container>
      Galaea <Avatar />
    </Container>
  );
}
