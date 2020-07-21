import Controls from "./Controls.js";
import CommentAPI from "./CommentAPI.js";

const controls = new Controls();
const commentAPI = new CommentAPI();

class Comments {
	constructor() {
		this.wrapper = document.querySelector('.comments-wrapper');
		this.selectedComment = document.querySelector('.comment--active');
	}

	selectComment(el) {
		let selectedComment = el.closest('.comment');

		if (selectedComment == this.selectedComment && !el.closest('.comment__content__buttons__reply'))
			return null;

		if (this.isChildCommentElement(selectedComment))
			selectedComment.classList.add('comment--child--active');
		else
			selectedComment.classList.add('comment--parent--active');

		selectedComment.classList.add('comment--active');
		return selectedComment;
	}

	unselectComment(el) {
		this.selectedComment.classList.remove('comment--active');
		this.selectedComment.classList.remove('comment--child--active');
		this.selectedComment.classList.remove('comment--parent--active');
	}

	isChildCommentElement(el) {
		return el.classList.contains('comment--child');
	}

	hasParent(commentData) {
		return commentData.parent !== null;
	}

	buildComment(commentData) {
		commentData.reply = '';

		if (this.hasParent(commentData)) {
			commentData.relationshipClass = 'comment--child';
			commentData.bootstrapClasses = 'offset-md-2 col-10';
		} else {
			commentData.relationshipClass = 'comment--parent';
			commentData.bootstrapClasses = 'col-12';
			commentData.reply = `<span data-reply-id="${commentData.id}" data-reply-creator="${commentData.creator}" class="comment__content__buttons__button comment__content__buttons__reply">Reply</span>`
		}

		commentData.edit = `<span data-edit-id="${commentData.id}" class="comment__content__buttons__button comment__content__buttons__edit">Edit</span>`;
		commentData.delete = `<span data-delete-id="${commentData.id}" class="comment__content__buttons__button comment__content__buttons__delete">Delete</span>`;

		let commentTemplate = this.insertCommentDataToTemplate(commentData);
		this.appendComment(commentData, commentTemplate);

	}

	insertCommentDataToTemplate(commentData) {
		return `
		<div class="comment w-100 ${commentData.relationshipClass}"  data-comment-id="${commentData.id}">
			<div class="comment__content pt-2 pb-3 ${commentData.bootstrapClasses}">
				<h1 class="comment__content__creator w-100">${commentData.creator}</h1>
				<h2 class="comment__content__title w-100">${commentData.title}</h2>
				<p class="comment__content__message w-100">${commentData.message}</p>
				<div class="comment__content__buttons col-12 text-right">
					${commentData.edit}
					${commentData.reply}
					${commentData.delete}
				</div>
			</div>
		</div>
		`;
	}

	appendComment(commentData, commentTemplate) {
		if (this.hasParent(commentData))
			this.appendChildComment(commentData, commentTemplate)
		else
			this.appendParentComment(commentData, commentTemplate)
	}

	appendChildComment(commentData, commentTemplate) {
		/* Changing the temporary element innerHTML and appending it into the row preserves the event listener attached
		* onto the reply button on the root comment. If we just did querySelector(parentID).innerHTML += commentTemplate it would
		* destroy the event listener that's attached to the root comment */
		const temporaryEl = document.createElement('div');
		temporaryEl.innerHTML = commentTemplate;
		let comment = temporaryEl.querySelector('.comment')
		this.attachDeleteListener(comment);
		this.attachEditListener(comment);
		document.querySelector(`[data-id="${commentData.parent}"]`).appendChild(comment);
	}

	appendParentComment(commentData, commentTemplate) {
		let row = this.createNewRow(commentData.id);
		row.innerHTML = commentTemplate;
		this.attachReplyListener(row);
		this.attachDeleteListener(row);
		this.attachEditListener(row);
		this.wrapper.appendChild(row);
	}

	attachReplyListener(row) {
		let replyButton = row.querySelector('.comment__content__buttons__reply');

		if (replyButton) {
			replyButton.addEventListener('click', () => {
				controls.focusOnControls({
					action: 'reply',
					id: replyButton.getAttribute('data-reply-id'),
					creator: replyButton.getAttribute('data-reply-creator')
				});
			});
		}
	}

	attachDeleteListener(el) {
		let deleteButton = el.querySelector('.comment__content__buttons__delete');

		if (deleteButton) {
			deleteButton.addEventListener('click', () => {
				commentAPI.deleteComment({
					id: deleteButton.getAttribute('data-delete-id'),
				});
				this.deleteComment(el);
			});
		}
	}

	attachEditListener(el) {
		let editButton = el.querySelector('.comment__content__buttons__edit');

		if (editButton) {
			editButton.addEventListener('click', () => {
				controls.focusOnControls({
					action: 'edit',
					id: editButton.getAttribute('data-edit-id'),
					creator: el.querySelector('.comment__content__creator').textContent,
					title: el.querySelector('.comment__content__title').textContent,
					message: el.querySelector('.comment__content__message').textContent,
				});
			});
		}
	}

	createNewRow(id) {
		const row = document.createElement('div');
		row.className = 'row row--comment mb-3';
		row.setAttribute('data-id', id);

		row.addEventListener('click', () => {
			if (this.selectedComment)
				this.unselectComment(this.selectedComment);
			this.selectedComment = this.selectComment(event.target);
		});

		return row;
	}


	updateComment(newComment) {
		let el = document.querySelector(`[data-comment-id="${newComment.id}"].comment`);
		el.querySelector('.comment__content__creator').textContent = newComment.creator;
		el.querySelector('.comment__content__title').textContent = newComment.title;
		el.querySelector('.comment__content__message').textContent = newComment.message;

	}

	deleteComment(el) {
		el.parentNode.removeChild(el);
	}
}

export default Comments;