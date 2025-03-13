import { Mooc, MoocFactory } from '@App/internal/app/mooc';
import { Application } from '@App/internal/application';
// import { ZsglCourse } from './course';
import { ZsglVideo } from './video';
export class ZsglPlatform implements MoocFactory{
    public CreateMooc(): Mooc {
        // 通过URL特征进行平台识别
        if (this.isZsglCoursePage()) {
            console.log('当前平台：zsgl');
            Application.App.config.SetNamespace('zsgl')
            return new ZsglVideo();
        }
        return null;
    }
    private isZsglCoursePage(): boolean {
        // console.log("zsgl platform check url:",document.URL);
        // return document.URL.indexOf('/courseDetail')>0;
            return window.location.hash.includes('/home/courseDetail/');
    }
}