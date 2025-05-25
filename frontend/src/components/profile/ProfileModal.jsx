import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import { IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";
import { updateProfile, BASE_URL } from '../../services/profileService';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  outline: "none",
  p: 4,
  borderRadius: 4,
};

export default function ProfileModal({ open, handleClose, profile, onUpdateSuccess }) {
  const [uploading, setUploading] = React.useState(false);
  const [previewUrls, setPreviewUrls] = React.useState({
    backgroundImage: profile?.backgroundImage || null,
    image: profile?.profileImage || null
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      if (values.fullName) formData.append('fullName', values.fullName);
      if (values.bio) formData.append('bio', values.bio);
      if (values.website) formData.append('website', values.website);
      if (values.location) formData.append('location', values.location);
      if (values.backgroundImage instanceof File) {
        formData.append('backgroundImage', values.backgroundImage);
      }
      if (values.image instanceof File) {
        formData.append('profileImage', values.image);
      }

      const response = await updateProfile(formData);
      console.log('Update profile response:', response); // Debug log
      if (response) {
        onUpdateSuccess(response);
        handleClose();
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
    finally {
      setUploading(false);
    }
  };

  const handleImageChange = (event) => {
    try {
      setUploading(true);
      const { name } = event.target;
      const file = event.target.files[0];
      
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        console.log(`Preview URL for ${name}:`, previewUrl); // Debug log
        setPreviewUrls(prev => ({ ...prev, [name]: previewUrl }));
        formik.setFieldValue(name, file);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: profile?.fullName || "",
      website: profile?.website || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      backgroundImage: null,
      image: null
    },
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    console.log('Profile prop changed:', profile); // Debug log
    setPreviewUrls({
      backgroundImage: profile?.backgroundImage || null,
      image: profile?.profileImage || null
    });
  }, [profile]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <IconButton onClick={handleClose} aria-label="delete">
                  <CloseIcon />
                </IconButton>
                <p className="text-sm">Edit Profile</p>
              </div>
              <Button type="submit" disabled={uploading}>Save</Button>
            </div>
            <div className="hideScrollbar overflow-y-scroll overflow-x-hidden h-[80vh]">
              <React.Fragment>
                <div className="w-full">
                  <div className="relative">
                    {previewUrls.backgroundImage ? (
                      <img
                        src={previewUrls.backgroundImage}
                        alt="Background"
                        className="w-full h-[15rem] object-cover object-center"
                        onError={(e) => console.error('Modal background image failed to load:', previewUrls.backgroundImage)} // Debug log
                      />
                    ) : (
                      <div className="w-full h-[15rem] bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Background Image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      name="backgroundImage"
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className="w-full transform -translate-y-20 ml-4 h-[6rem]">
                  <div className="relative">
                    <Avatar
                      alt={profile?.username}
                      src={previewUrls.image || undefined}
                      sx={{
                        width: "10rem",
                        height: "10rem",
                        border: "4px solid white",
                      }}
                      onError={(e) => console.error('Modal profile image failed to load:', previewUrls.image)} // Debug log
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-[10rem] h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      name="image"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </React.Fragment>
              <div className="flex flex-col mt-5">
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  className="!mb-4"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="bio"
                  name="bio"
                  label="Bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  error={formik.touched.bio && Boolean(formik.errors.bio)}
                  helperText={formik.touched.bio && formik.errors.bio}
                  className="!mb-4"
                />

                <TextField
                  fullWidth
                  id="website"
                  name="website"
                  label="Website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  error={formik.touched.website && Boolean(formik.errors.website)}
                  helperText={formik.touched.website && formik.errors.website}
                  className="!mb-4"
                />

                <TextField
                  fullWidth
                  id="location"
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                  className="!mb-4"
                />

                <div className="my-3 !mb-4">
                  <p className="text-lg">Birth date .Edit</p>
                  <p className="text-2xl">August 20</p>
                </div>

                <p className="py-3 text-lg !mb-4">Edit Professional Profile</p>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}