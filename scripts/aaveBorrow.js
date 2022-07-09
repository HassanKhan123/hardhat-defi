const { getWeth } = require("./getWeth");

const main = async () => {
  await getWeth();
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
