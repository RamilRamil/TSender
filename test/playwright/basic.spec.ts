import basicSetup from "../wallet-setup/basic.setup";
import {testWithSynpress} from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const {expect} = test;

test('has a title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('TSender UI');
});

test("should show the airdrop form when connected, otherwise not", async({page, context, metamaskPage, extensionId}) => {
  test.setTimeout(60000);
  await page.goto('/');
  await expect(page.getByText("Connect your wallet to continue")).toBeVisible();

  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
  await page.getByTestId('rk-connect-button').click()
  await page.getByTestId('rk-wallet-option-io.metamask').waitFor({
    state: 'visible',
    timeout: 40000
  });
  await page.getByTestId('rk-wallet-option-io.metamask').click();
  await page.waitForTimeout(10000);
  await metamask.connectToDapp()

  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH"
  }
  await metamask.addNetwork(customNetwork);

  await expect(page.getByText('Token Address')).toBeVisible();
});
