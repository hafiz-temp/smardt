class CommentAPI {
	constructor(commentsController) {

		this.apiResponse = [
			{
				"id": 1,
				"title": "Msg Title #1",
				"message": "Msg Content #1",
				"creator": "mike",
				"created_at": "2003-02-01T10:43:09.054453+08:00",
				"parent": null
			},

			{
				"id": 2,
				"title": "Msg Title #2",
				"message": "Msg Content #2",
				"creator": "hafiz",
				"created_at": "2001-02-02T10:43:09.054453+08:00",
				"parent": null
			},
			{
				"id": 3,
				"title": "Msg Title #3",
				"message": "Msg Content #3",
				"creator": "bob",
				"created_at": "2002-02-03T10:43:09.054453+08:00",
				"parent": null
			},
			{
				"id": 5,
				"title": "Msg Title #5",
				"message": "Msg Content #5",
				"creator": "jasmine",
				"created_at": "2005-02-03T10:43:09.054453+08:00",
				"parent": null
			},
			{
				"id": 6,
				"title": "Msg Title #6",
				"message": "Msg Content #6",
				"creator": "sally",
				"created_at": "2006-02-03T10:43:09.054453+08:00",
				"parent": 5
			}];
		this.existingComments = [];

		this.commentsController = commentsController;
	}

	getComments() {

		// fetch('https://staging.smardtportal.com/exam/hafiz/')
		// 	.then(response => {
		// 		response.json();
		// 	}).then(result => {
		// 	this.existingComments = result.body;
		// 	this.latestDate = this.getLatestDate(this.existingComments);
		// 	this.latestID = this.existingComments.reduce((a, b) => {
		// 		return a.id > b.id ? a.id : b.id;
		// 	});
		// 	return this.existingComments;
		// }).then(() => {
		// 	this.existingComments.map(comment => {
		// 		this.commentsController.buildComment(comment);
		// 	})
		// });

		this.latestDate = this.getLatestDate(this.apiResponse);

		this.latestID = this.apiResponse.reduce((a, b) => {
			return a.id > b.id ? a.id : b.id;
		});
		return this.apiResponse;
	}

	getLatestcomments() {
		// fetch('https://staging.smardtportal.com/exam/hafiz/')
		// 	.then(response => {
		// 		response.json();
		// 	}).then(result => {
		// 		let latestComments = result.body.filter(comment => {
		// 			if (new Date(comment.created_at) > this.latestDate) {
		//				this.existingComments.push(comment);
		// 				this.commentsController.buildComment(comment);
		// 				return comment;
		// 			}
		// 		});
		//
		// 		if (latestComments.length == 1) {
		// 			this.latestDate = new Date(latestComments[0].created_at)
		// 		} else if (latestComments.length > 1) {
		// 			this.latestDate = this.getLatestDate(latestComments);
		// 		}
		// 	return;
		// });

		let latestComments = this.apiResponse.filter(comment => {
			if (new Date(comment.created_at) > this.latestDate) {
				this.commentsController.buildComment(comment);
				return comment;
			}
		});

		if (latestComments.length == 1) {
			this.latestDate = new Date(latestComments[0].created_at)
		} else if (latestComments.length > 1) {
			this.latestDate = this.getLatestDate(latestComments);
		}
	}

	getLatestDate(commentArray) {
		return commentArray.reduce((a, b) => {
			let date1 = new Date(a.created_at);
			let date2 = new Date(b.created_at);
			return date1 > date2 ? date1 : date2;
		});
	}

	postComment(newComment) {
		// fetch('https://staging.smardtportal.com/exam/hafiz/', {
		// 	method: 'POST',
		// })
		// 	.then(response => response.json()).then(() => {
		// 	this.getLatestcomments();
		// })


		newComment.created_at = new Date().toISOString();
		newComment.id = ++this.latestID;
		this.apiResponse.push(newComment);

		this.getLatestcomments();
	}

	updateComment(newComment) {
		// fetch(`https://staging.smardtportal.com/exam/hafiz/${newComment.id}`, {
		// 	method: 'PUT',
		// })
		// 	.then(response => response.json()).then(() => {
		// 	this.commentsController.updateComment(newComment);
		// })

		this.commentsController.updateComment(newComment);
	}

	deleteComment(id) {
		// fetch(`https://staging.smardtportal.com/exam/hafiz/${id}`, {
		// 	method: 'DELETE',
		// })
		// 	.then(response => response.json()).then(() => {
		// 	this.commentsController.delete(id);
		// })
	}
}

export default CommentAPI;

