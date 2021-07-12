import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import User from "./User";

@Entity("reply")
export default class Reply {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  content!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Comment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_comment_idx" })
  comment: Comment;

  @Column()
  fk_comment_idx: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_user_email" })
  user: User;

  @Column()
  fk_user_email: string;

  @Column()
  name: string;

  @ManyToOne(() => Post, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_post_idx" })
  post: Post;

  @Column()
  fk_post_idx: number;
}