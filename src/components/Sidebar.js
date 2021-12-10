import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useRealmApp } from "../RealmApp";
import useProjects from "../graphql/useProjects";
import Card from "./Card";
import { uiColors } from "@leafygreen-ui/palette";

export default function Sidebar({
  currentProject,
  setCurrentProject,
  setIsEditingPermissions,
}) {
  const projects = useProjects();
  const app = useRealmApp();

  return (
    <SidebarContainer>
      <div style={{ color: "#e86a92", fontSize: "1.5rem" }}>
        <h1>
          Collab-R8{" "}
          <span role="img" aria-label="handshake">
            🤝
          </span>
        </h1>
      </div>
      <Card>
        <SectionHeading>Projects</SectionHeading>
        <SectionList>
          {projects.map((project) => (
            <SectionListItem
              key={project.partition}
              onClick={() => setCurrentProject(project)}
              isSelected={project.partition === currentProject?.partition}
            >
              {project.name}
            </SectionListItem>
          ))}
        </SectionList>
        <UserDetails
          user={app.currentUser}
          handleLogout={() => {
            app.logOut();
          }}
          handleEditPermissions={() => {
            setIsEditingPermissions(true);
          }}
        />
      </Card>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: flex;
  background: #faedca;
  flex-direction: column;
  padding: 40px;
  border-right: 5px solid #e86a92;
`;

const SectionHeading = styled.h2`
  margin: 0;
  padding: 8px;
`;
const SectionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const SectionListItem = styled.li(
  (props) => css`
    padding: 8px 12px;
    border-radius: 8px;
    background: ${props.isSelected && uiColors.green.light2};
    :hover {
      background: ${!props.isSelected && uiColors.gray.light1};
    }
  `
);

function UserDetails({ user, handleLogout, handleEditPermissions }) {
  return (
    <UserDetailsContainer>
      <Username>{user.profile.email}</Username>
      <TextButton onClick={handleEditPermissions}>Manage My Project</TextButton>
      <TextButton onClick={handleLogout}>Log Out</TextButton>
    </UserDetailsContainer>
  );
}

const UserDetailsContainer = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
`;

const Username = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  text-decoration: none;
  cursor: pointer;
  color: #e86a92;
`;
