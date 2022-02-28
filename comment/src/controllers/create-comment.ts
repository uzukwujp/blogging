import { Request, Response } from "express";
import { NotFoundError } from "@jaypeeblogs/common";
import { natsWrapper } from "../natsWrapper";

import Post from "../models/post";
import Comment from "../models/comment";
import { CommentCreationPublisher } from "../events/comment-creation-publisher";

export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw new NotFoundError("post not found");
  }

  const comment = Comment.build({
    postId: postId,
    content: content,
    author: req.currentUser!.id,
  });

  await comment.save()

  await new CommentCreationPublisher(natsWrapper.client).publish({
    id: comment._id,
    postId: comment.postId,
    content: comment.content,
    author: comment.author,
    status: comment.status,
    version: comment.version,
  });

  res.status(201).send(comment);
};
