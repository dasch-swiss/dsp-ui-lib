# AdminImage (Directive)

You can use the admin image module for user avatar together with gravatar.com and for project logos.

The feature of this module ist the error handling: In case of a 404 error of the image source (img src) the module shows a default image-not-found image. Or a default user profile icon (type=user), or a default project icon (type=project).

## Parameters

Name | Type | Description
--- | --- | ---
image | string | source of the image:<br> - in case of user (gr)avatar it's the e-mail address, <br> - in case of project logo it's the image url
type | string | type of image; you can use it with:<br> - project <br> - user

## Examples

### User Avatar

**HTML file**
```html
// Default user profile image
<img kuiAdminImage [image]="imgDefaultUser" [type]="'user'" />

// Avatar example: 'salsah' user
<img kuiAdminImage [image]="imgSalsahUser" [type]="'user'" />

// User image on error
<img kuiAdminImage [image]="null" [type]="'user'" />

// Default error image
<img kuiAdminImage [image]="'null'" />
```

**Typescript file**
```ts
imgDefaultUser: string = 'root@example.com';
imgSalsahUser: string = 'salsah@dasch.ch';
```

![User avatars](../../assets/images/admin-image1.png)

<hr>

### Project Logo

**HTML file**
```html
// Default project image
<img kuiAdminImage [image]="imgDefaultProject" [type]="'project'" />

// Logo example: 'dasch' project
<img kuiAdminImage [image]="imgDaschProject" [type]="'project'" />
```

**Typescript file**
```ts
imgDefaultProject: string = undefined;
imgDaschProject: string = 'http://dasch.swiss/content/images/2017/11/DaSCH_Logo_RGB.png';
```

![Default project logos](../../assets/images/admin-image2.png)
