機械学習モデルの練習アプリ

モデル自体の作成はGooglecolabで作成

Homeゲームか、先発投手の防御率、WHIP,各チームの打撃の指標としてAVG,OBP,SLG,OPS,投手の指標としてERA,WHIPの平均を特徴量としている。


https://colab.research.google.com/drive/1c09iMYyVO71DL9VHcnOrLi3CxgLIy-F-#scrollTo=AxCLh49kPcEO

WEBアプリについてはデプロイ済
firebaseにてホスティングとデプロイを行い、GitHub Actionsで自動化を行った。

https://baseball-app-fbb26.web.app/

アプリ自体はMLBのチームを入れて先発投手を選択すると予想結果が出ます！

まだ2023年のデータのみのモデルであるのと、モデル選定に時間をかけられていないので正答率は59%ほどである。

野球に試合予想においては60%でもかなり高い数値となり70%を超えると評論家以上というデータもあるので
今後60%となるように特徴量の選定やモデル選定をしていきたい。
