import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  user: { nameUser: string, email: string } = {nameUser: '', email: ''};
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getUser(id: string) {
    return this.http.get<{ nameUser: string, email: string }>(
      'http://localhost:3000/api/user/' + id
    ).subscribe(
      (response: { nameUser: string, email: string }) => {
        this.user.nameUser = response.nameUser;
        this.user.email = response.email;
        localStorage.setItem('nameUser', response.nameUser);
      }
    );
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              nameUser: post.nameUser,
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string, nameUser: string, title: string, content: string, imagePath: string, creator: string;
    }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('nameUser', this.user.nameUser);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          nameUser: null,
          title,
          content,
          imagePath: responseData.post.imagePath,
          creator: null
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('nameUser', this.user.nameUser);
    } else {
      postData = {
        id,
        nameUser: this.user.nameUser,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          nameUser: this.user.nameUser,
          title,
          content,
          imagePath: '',
          creator: null
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
