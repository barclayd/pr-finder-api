# PR Finder API

Lambda provisioned for GitHub OAuth using serverless framework to facilitate [PR Finder](https://github.com/barclayd/pr-finder) IDE extension

### How to run

```shell
git clone https://github.com/barclayd/pr-finder-api.git
cd pr-finder-api
npm i
```

### How to run single function locally

Replace `<NAME OF FUNCTION>` with function name

```shell
./scripts/localFunction.sh <NAME OF FUNCTION>
```

### How to deploy single function

Replace `<NAME OF FUNCTION>` with function name

```shell
npm run deploy:single-function <NAME OF FUNCTION>
```

### How to deploy all functions

```shell
npm run deploy:all
```
