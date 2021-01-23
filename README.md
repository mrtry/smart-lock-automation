# smart-lock-automation

SwitchBotとSesameを連携させて、家のオートロックと物理鍵を開けるくん
Raspberry Pi3などにインストールして使う

## 実行方法

```shell script
$ npm start
```

## 環境構築

- GCPのサービスアカウントのキー(JSON)をディレクトリに`smart-lock-automation-key.json`という名前で置く
- `$ ./setup.sh`を実行する
- `config/default.json5`を適切に書き換える
