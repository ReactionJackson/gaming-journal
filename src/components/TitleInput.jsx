"use client";

import styled from "styled-components";

const Input = styled.input`
  position: relative;
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.02em;
  width: 100%;
  height: 28px;

  &:focus {
    outline: none;
  }
`;

export default function TitleInput({ value = "", placeholder = "", onChange }) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      name="Entry Title"
      autoFocus
    />
  );
}
