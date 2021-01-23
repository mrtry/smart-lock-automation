# make config dir
mkdir config
echo "
{
  "subscription_name": "",
  "switchbot_mac_address": "",
  "sesame_api_token": "",
  "sesame_device_id": "",
  "slack_webhook_url": "",
  "accessToken": [
      ""
  ]
}
" > config/default.json5

# setup SwitchBot
sudo apt-get update
sudo apt-get --yes install git python-dev python-pip python-pexpect libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev
sudo pip install bluep

npm install
