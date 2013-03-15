if [[ ! `which brew` ]]; then
  echo Installing Homebrew
  `ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"`
else
  echo Brew installed. +1
fi

if [[ ! `which node` ]]; then
  echo Installing node
  `brew install node`
else
  echo Node.js already installed. +1
fi

if [[ ! `which npm` ]]; then
  echo Installing npm
  `brew install npm`
else
  echo NPM installed. +1
fi

echo All set. Run npm start.
