import { AuthService } from './../../auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { SubredditService } from 'src/app/subreddit/subreddit.service';
import { SubredditModel } from 'src/app/subreddit/subreddit-response';
import { User } from 'src/app/auth/signup/userModel';

@Component({
  selector: 'app-subreddit-side-bar',
  templateUrl: './subreddit-side-bar.component.html',
  styleUrls: ['./subreddit-side-bar.component.css']
})
export class SubredditSideBarComponent implements OnInit {
  subreddits: Array<SubredditModel> = [];
  users: Array<User> = [];
  displayViewAll: boolean;

  constructor(private subredditService: SubredditService, private authService: AuthService) {
    this.subredditService.getAllSubreddits().subscribe (data => {
      if (data.length > 3) {
        this.subreddits = data.splice(0, 3);
        this.displayViewAll = true;
      } else {
        this.subreddits = data;
      }
    })
    this.authService.getAllUsers().subscribe(data => {
        this.users = data
        this.displayViewAll = true;
    }
    )
  }


  ngOnInit(): void { }

}