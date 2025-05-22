import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Verified from "../../assets/verified.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  outline: "none",
};

const feature = [
  "Lorem ipsum dolor sit, amet consectetur adipisicing el.",
  "Lorem ipsum dolor sit, amet consectetur adipisicing el.",
  "Lorem ipsum dolor sit, amet consectetur adipisicing el.",
];

export default function SubscriptionModal({handleClose,open}) {
  //const [open, setOpen] = React.useState(false);
  //const handleOpen = () => setOpen(true);
  //const handleClose = () => setOpen(false);
  const [plan, setPlan] = React.useState("Anually");

  return (
    <div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <IconButton
                onClick={handleClose}
                aria-label="delete"
                sx={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  zIndex: 10,
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="flex justify-center py-10">
              <div className="w-[80%] space-y-10">
                <div className="p-5 rounded-md flex items-center justify-between shadow-lg bg-slate-200">
                  <h1 className="text-xl pr-5">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.{" "}
                  </h1>
                  <img src={Verified} alt="" className="w-24 h-24" />
                </div>

                <div className="flex justify-between border rounded-full px-5 py-3 border border-gray-500">
                  <div>
                    <span
                      onClick={() => setPlan("Anually")}
                      className={`${
                        plan === "Anually" ? "text-black" : "text-gray-400"
                      }cursor-pointer`}
                    >
                      Anually
                    </span>
                    <span className="text-green-500 text-sm ml-5">
                      Save 12%
                    </span>
                  </div>

                  <p
                    onClick={() => setPlan("monthly")}
                    className={`${
                      plan === "Monthly" ? "text-black" : "text-gray-400"
                    }cursor-pointer`}
                  >
                    Monthly
                  </p>
                </div>

                <div className="space-y-3">
                  {feature.map((item) => (
                    <div className="flex items-center space-x-5">
                      <FiberManualRecordIcon
                        sx={{ width: "7px", height: "7px" }}
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="cursor-pointer flex justify-center bg-gray-700 text-white rounded-full px-5 py-3">
                  <span className="line-through italic">$100</span>
                  <span className="px-5">$80/year</span>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
