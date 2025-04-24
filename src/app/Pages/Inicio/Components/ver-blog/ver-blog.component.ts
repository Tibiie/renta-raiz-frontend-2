import { Component, inject, Inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../shared/navbar/navbar.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver-blog',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './ver-blog.component.html',
  styleUrl: './ver-blog.component.scss'
})
export class VerBlogComponent implements OnInit {

  blogId: number = 0;

  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogId = +params['id'];
    });

    console.log(this.blogId);

  }
}
