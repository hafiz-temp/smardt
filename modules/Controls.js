class Controls {
	constructor(commentAPI) {
		this.body = document.querySelector('body');
		this.wrapper = document.querySelector('.controls-wrapper');
		this.creator = document.querySelector('.controls__creator');
		this.title = document.querySelector('.controls__title');
		this.textbox = document.querySelector('.controls__message');
		this.sendButton = document.querySelector('.controls__send');
		this.controls = [this.creator, this.title, this.textbox]

		this.commentAPIController = commentAPI;
	}

	events() {
		this.body.addEventListener('click', () => {
			if (event.target !== this.wrapper && !event.target.closest('.controls-wrapper') && !event.target.classList.contains('comment__content__buttons__reply') && !event.target.classList.contains('comment__content__buttons__edit')) {
				this.setWrapperActive(false);
			}
		});

		this.controls.map(control => {
			control.addEventListener('click', () => {
				this.focusOnControls(null, control)
			})
		});

		this.textbox.addEventListener('input', () => {
			return this.toggleSendButton();
		});

		this.title.addEventListener('input', () => {
			return this.toggleSendButton();
		});

		this.textbox.addEventListener('keypress', () => {
			if (event.keyCode == 13 && !event.shiftKey && this.allInputsFilled()) {
				event.preventDefault();
				this.sendMessage();
			}
		});

		this.sendButton.addEventListener('click', () => {
			this.sendMessage();
		})
	}

	allInputsFilled() {
		return (this.title.value.length > 0) && (this.creator.value.length > 0) && (this.textbox.value.length > 0);
	}

	focusOnControls(options = null, el) {
		this.setWrapperActive(true);
		this.setTextboxReplyData(options);

		if (el) {
			return el.focus();
		} else {
			for (let control of this.controls) {
				if (control.value.length < 1) {
					control.focus();
					break;
				}
			}
			this.textbox.focus();
		}
	}

	setTextboxReplyData(options) {
		if (options && options.action == 'reply') {
			this.textbox.setAttribute('data-reply-id', options.id);
			this.textbox.placeholder = `Replying to ${options.creator}`;
		} else if (options && options.action == 'edit') {
			this.textbox.setAttribute('data-edit-id', options.id)
			this.creator.value = options.creator;
			this.textbox.value = options.message;
			this.title.value = options.title;
		}
	}

	setWrapperActive(on) {
		if (on)
			return this.wrapper.classList.add('controls-wrapper--active');
		return this.wrapper.classList.remove('controls-wrapper--active');

	}

	toggleSendButton() {
		return this.sendButton.disabled = !this.allInputsFilled();
	}

	sendMessage() {
		let parent = this.textbox.getAttribute('data-reply-id') == null ? null : Number(this.textbox.getAttribute('data-reply-id'));

		let newComment = {
			creator: this.creator.value,
			title: this.title.value,
			message: this.textbox.value,
			parent: parent,
		}

		if (this.textbox.getAttribute('data-edit-id') != null) {
			newComment.id = this.textbox.getAttribute('data-edit-id');
			this.commentAPIController.updateComment(newComment);
		} else {
			this.commentAPIController.postComment(newComment);
		}

		this.clearInputs();
		return this.toggleSendButton();
	}

	deleteMessage(id) {
		this.commentAPIController.deleteComment(id);
	}

	clearInputs() {
		this.textbox.value = '';
		this.title.value = '';
		this.textbox.removeAttribute('data-edit-id');
		this.textbox.removeAttribute('data-reply-id');
		this.textbox.placeholder = 'Message to All...'
	}
}

export default Controls;