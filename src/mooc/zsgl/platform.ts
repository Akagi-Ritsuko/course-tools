import { Mooc, MoocFactory } from '@App/internal/app/mooc';
import { Application } from '@App/internal/application';
// import { ZsglCourse } from './course';
import { ZsglVideo } from './video';
export class ZsglPlatform implements MoocFactory{
    public CreateMooc(): Mooc {
        // 通过URL特征进行平台识别
        if (this.isZsglCoursePage()) {
            Application.App.config.SetNamespace('zsgl')
            return new ZsglVideo();
        }
        return null;
    }
    private isZsglCoursePage(): boolean {
        return document.URL.indexOf('/courseDetail')>0;
    }
}