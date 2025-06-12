import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Verified from "../../assets/verified.png";
import ProfileImage from "../../assets/profile.png";
import ImageIcon from "@mui/icons-material/Image";
import { useFormik } from "formik";
import { createComment, getComments } from "../../services/commentService";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import * as Yup from 'yup';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "80vh",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 4,
};

const validationSchema = Yup.object({
  content: Yup.string()
    .required("Reply text is required")
    .max(280, "Reply cannot exceed 280 characters")
});

export default function ReplyModal({ handleClose, open, post }) {
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && post?.id) {
      fetchComments();
    }
  }, [open, post?.id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getComments(post.id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setUploadingImage(true);
      setError("");
      await createComment(post.id, values.content, selectedImage);
      resetForm();
      setSelectedImage(null);
      await fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setError("");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="reply-modal"
      aria-describedby="reply-to-tweet"
    >
      <Box sx={style}>
        {/* Original Post */}
        <div className="flex space-x-5 mb-4">
          <Avatar
            onClick={() => navigate(`/profile/${post?.user?.username}`)}
            alt={post?.user?.username}
            src={post?.user?.profileImage || ProfileImage}
            className="cursor-pointer"
          />
          <div className="w-full">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{post?.user?.fullName}</span>
              <span className="text-gray-600">@{post?.user?.username}</span>
              {post?.user?.verified && (
                <img src={Verified} alt="verified" className="w-5 h-5" />
              )}
            </div>
            <p className="mt-2 text-gray-800">{post?.content}</p>
            {post?.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="mt-2 max-w-full rounded-xl"
              />
            )}
          </div>
        </div>

        <Divider sx={{ my: 2 }} />

        {/* Comments Section */}
        <div className="max-h-[300px] overflow-y-auto mb-4 pr-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <CircularProgress size={24} />
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 mb-4 p-2 hover:bg-gray-50 rounded-lg">
                <Avatar
                  src={comment.user.profileImage || ProfileImage}
                  alt={comment.user.username}
                  className="cursor-pointer"
                  onClick={() => navigate(`/profile/${comment.user.username}`)}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold hover:underline cursor-pointer">
                      {comment.user.fullName}
                    </span>
                    <span className="text-gray-600">
                      @{comment.user.username}
                    </span>
                    <span className="text-gray-500 text-sm">
                      • {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-800">{comment.content}</p>
                  {comment.imageUrl && (
                    <img
                      src={comment.imageUrl}
                      alt="Comment"
                      className="mt-2 max-w-[200px] rounded-lg border border-gray-100"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No replies yet. Start the conversation!</p>
          )}
        </div>

        {/* Reply Form */}
        <div className="flex space-x-4 pt-2 border-t border-gray-100">
          <Avatar
            alt="Your Profile"
            src={ProfileImage}
          />
          <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
              <textarea
                name="content"
                placeholder="Tweet your reply"
                className="w-full border-none outline-none text-lg bg-transparent resize-none"
                rows={2}
                {...formik.getFieldProps("content")}
              />
              {formik.errors.content && formik.touched.content && (
                <p className="text-red-500 text-sm mb-2">
                  {formik.errors.content}
                </p>
              )}

              {selectedImage && (
                <div className="relative mt-2 group">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="max-h-[200px] rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm mb-2">{error}</p>
              )}

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <label className="cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors">
                    <ImageIcon className="text-blue-400" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleSelectImage}
                      accept="image/*"
                    />
                  </label>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={uploadingImage || !formik.values.content || !formik.isValid}
                  sx={{
                    borderRadius: "9999px",
                    textTransform: "none",
                    px: 4,
                    py: 1,
                    bgcolor: "#1DA1F2",
                    '&:hover': {
                      bgcolor: "#1a8cd8"
                    }
                  }}
                >
                  {uploadingImage ? "Posting..." : "Reply"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Box>
    </Modal>
  );
}