import { Request, Response } from "express";
import { NotFoundError, NotAuthorisedError } from "@jaypeeblogs/common";
import { natsWrapper } from "../natsWrapper";

import Comment from "../models/comment";
import { CommentDeletedPublisher } from "../events/comment-delete-publisher";

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const comment = await Comment.findById({ _id: commentId });

  if (!comment) {
    throw new NotFoundError("comment not found");
  }

  if (comment.author !== req.currentUser!.id) {
    throw new NotAuthorisedError("forbidden not authorised");
  }

  const commentDeleted = await Comment.deleteOne({ _id: commentId });

  await new CommentDeletedPublisher(natsWrapper.client).publish({
    id: comment._id,
    postId: comment.postId,
    version: comment.version,
  });

  res.send(commentDeleted);
};
