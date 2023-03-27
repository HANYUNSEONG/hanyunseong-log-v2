---
title: vercel에 배포한 내 블로그에 도메인을 적용해보자
description: 내 블로그에 도메인 적용하기
date: 2023-03-27 23:58:57
published: true
slug: register-odmain-in-my-blog
tags:
  - vercel
  - google domain
---

들어가기에 앞서 도메인을 적용하려면 도메인을 소유하고 있어야 한다.  
필자의 경우 google domain에서 도메인을 구입했고 그 내용은 [여기](./buy-domain-in-google-domain)에서 볼 수 있다.

자 도메인을 구매(소유)를 했으면 등록을 하러 가보자

## vercel 프로젝트 세팅

먼저 vercel에 배포한 프로젝트에 설정 페이지를 들어가서 Domains를 클릭하자  
그럼 아래 화면이 보인다.

![img-1](/post/register-odmain-in-my-blog/img-1.png)

페이지에 있는 입력창에 소유한 도메인을 입력하고 "Add"를 눌러 추가를 하자  
이때 옵션이 3가지가 나오는데 필자는 3번째 옵션을 선택했다.
하단에 있는 "Add"를 한번 더 눌러서 추가한다.

![img-2](/post/register-odmain-in-my-blog/img-2.png)

그럼 이렇게 도메인이 추가가 되었는데 아직 적용이 안 된 모습을 볼 수 있다.  
이제는 도메인을 구매한 곳에서 DNS 설정을 해줘야 하는데 필자는 Google domain에서 구매를 했기 때문에  
Google domain에서 DNS 설정하는 페이지를 들어가준다.

## google domain DNS 설정

구글 도메인에 왼쪽에 `DNS` 메뉴를 클릭한다.

![img-3](/post/register-odmain-in-my-blog/img-3.png)

그럼 DNS를 설정할 수 있는 화면이 보이는데 여기에 입력하는 값은  
아까 vercel에서 등록한 부분을 잘 보면 Type, Name, Value가 보일 것이다.

그 값들을 여기에 넣어주고 저장을 누른다.

그럼 다시 돌아와서 vercel 프로젝트 설정에 Domains를 들어가서 등록한 도메인에 `Refresh`를 눌러보면

![img-4](/post/register-odmain-in-my-blog/img-4.png)

정상적으로 등록이 완료되었다.

이제 추가한 도메인으로 접속하고 정상적으로 페이지가 출력되는지 확인해보면 된다.
