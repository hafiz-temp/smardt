import CommentAPI from "./modules/CommentAPI.js";
import Comments from "./modules/Comments.js";
import Controls from "./modules/Controls.js";

document.addEventListener("DOMContentLoaded", function () {
	const comments = new Comments();
	const commentAPI = new CommentAPI(comments);
	const controls = new Controls(commentAPI);
	controls.events();

	const existingComments = commentAPI.getComments();
	existingComments.forEach(comment => {
		comments.buildComment(comment);
	});
});
