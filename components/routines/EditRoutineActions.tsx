import { useState } from "react";
import { DeleteRoutineModal } from "./DeleteRoutineModal";
import { EditRoutineModal } from "@/components/routines/EditRoutineModal";
import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { EditDayModal as AddDayModal } from "./EditDayModal";

enum Modal {
  EDIT = "edit",
  ADD = "add",
  DELETE = "delete",
}

export const EditRoutineActions = ({ workoutId }: { workoutId: number }) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClose = () => setModal(null);

  return (
    <>
      <AddDayModal
        open={modal === Modal.ADD}
        onClose={handleClose}
        workoutId={workoutId}
        dayId={null}
      />
      <EditRoutineModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        workoutId={workoutId}
      />
      <DeleteRoutineModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        workoutId={workoutId}
      />
      <IconButton
        aria-label={`Edit actions for workout ${workoutId}`}
        id={`edit-actions-${workoutId}`}
        aria-controls={menuOpen ? `edit-actions-${workoutId}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={`edit-actions-${workoutId}-menu`}
        aria-labelledby="edit-actions"
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setModal(Modal.ADD);
            }}
          >
            <ListItemIcon>
              <Add fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Day</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setModal(Modal.EDIT);
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setModal(Modal.DELETE);
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
