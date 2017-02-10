import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from '../project';
import { ProjectService } from '../project.service';

@Component({
    moduleId: module.id,
    selector: 'create-project',
    templateUrl: 'create.component.html',
    styleUrls: [ 'create.component.css' ]
})

export class CreateProjectComponent {

    project: Project;
    params: Params;
    public file_srcs: string[] = [];
    public debug_size_before: string[]= [];
    public debug_size_after: string[]=[];

    constructor(
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    fileChange(input){
        this.readFiles(input.files);
    }

    readFile(file, reader, callback){

        reader.onload = () => {
            callback(reader.result);
                    }
        reader.readAsDataURL(file);

    }


    readFiles(files, index=0) {

     let reader = new FileReader();
        if (index in files) {

           this.readFile(files[index], reader, (result) => {

                var img = document.createElement("img");

                img.src = result;
                    this.resize(img, 250, 250, (resized_jpeg, before, after)=>{
                    this.debug_size_before.push(before);
                    this.debug_size_after.push(after);

                    this.file_srcs.push(resized_jpeg);


                    this.readFiles(files, index+1);
                });
            });
        }else{

            this.changeDetectorRef.detectChanges();
        }
    }

    resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, callback){
          return img.onload = () => {


            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            var canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0,  width, height);

            var dataUrl = canvas.toDataURL('image/jpeg');

            callback(dataUrl, img.src.length, dataUrl.length);
        };
    }


    create(): void {

        let project = new Project(8, name, 1, 'description', 'logo.png', 'city', 'USA', '55311', 'Teens Give');

        this.projectService
            .add(project)
            .subscribe(
                response => {
                    this.router.navigate(['/']);
                },
                error => console.log(error)
            );
    }

    cancel(): void {
       this.location.back();
    }

}
