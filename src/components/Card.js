import React from "react";
import LGCard from "@leafygreen-ui/card";
import styled from "@emotion/styled";

const Layout = styled.div`
  padding: 8px;
  color: black;
  display: flex;
  border-radius: 5px;
  padding: 15px;
  margin: 2.5px;
  flex-direction: column;
  text-align: left;
  background-color: #c1dbb3;
  color: #1f1300;
`;

export default function Card({ children, ...props }) {
  return (
    <LGCard {...props}>
      <Layout>{children}</Layout>
    </LGCard>
  );
}
