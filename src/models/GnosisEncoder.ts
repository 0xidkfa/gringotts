import { ethers, BigNumber } from 'ethers';
import { MetaTransaction, TransactionType, encodeSingle } from 'ethers-multisend';
import erc20ABI from '../abis/mimERC20Abi.json';
import bentoBoxAbi from '../abis/bentoAbi.json';
import repayHelperAbi from '../abis/repayHelperAbi.json';
import {
  DEGENBOX_ADDRESS,
  MIM_CONTRACT_ADDR,
  MIM_TREASURY_ADDR,
  REPAY_HELPER_ADDR,
  SPELL_REWARD_DISTRIBUTOR_ADDR,
} from '../helpers/constants';
import { bn } from '@/helpers/utils';

export function getMimApproveTx({
  amount,
  mimAddress,
  degenboxAddress,
}: {
  amount: BigNumber;
  mimAddress: string;
  degenboxAddress: string;
}): MetaTransaction {
  let contractInterface = new ethers.utils.Interface(erc20ABI);

  return encodeSingle({
    id: '',
    type: TransactionType.callContract,
    to: mimAddress,
    abi: JSON.stringify(erc20ABI),
    functionSignature: contractInterface.getFunction('approve').format(),
    inputValues: {
      spender: degenboxAddress,
      amount: bn(amount).toString(),
    },
    value: '0',
  });
}

export function getMimDegenboxDepositTx({
  from,
  amount,
  degenboxAddress,
  mimAddress,
}: {
  from: string;
  amount: BigNumber;
  degenboxAddress: string;
  mimAddress: string;
}): MetaTransaction {
  let contractInterface = new ethers.utils.Interface(bentoBoxAbi);

  return encodeSingle({
    id: '',
    type: TransactionType.callContract,
    to: degenboxAddress,
    abi: JSON.stringify(bentoBoxAbi),
    functionSignature: contractInterface.getFunction('deposit').format(),
    inputValues: {
      token_: mimAddress,
      from: from,
      to: degenboxAddress,
      amount: bn(amount).toString(),
      share: '0',
    },
    value: '0',
  });
}

export function getMimTopupTx({
  cauldronAddress,
  safeAddress,
  amount,
  degenboxAddress,
  mimAddress,
}: {
  cauldronAddress: string;
  safeAddress: string;
  amount: BigNumber;
  degenboxAddress: string;
  mimAddress: string;
}): MetaTransaction {
  let contractInterface = new ethers.utils.Interface(bentoBoxAbi);

  return encodeSingle({
    id: '',
    type: TransactionType.callContract,
    to: degenboxAddress,
    abi: JSON.stringify(bentoBoxAbi),
    functionSignature: contractInterface.getFunction('deposit').format(),
    inputValues: {
      token_: mimAddress,
      from: safeAddress,
      to: cauldronAddress,
      amount: amount.toString(),
      share: '0',
    },
    value: '0',
  });
}

export function getMimRepayTx(to: string, cauldron: string, amount: BigNumber): MetaTransaction {
  let contractInterface = new ethers.utils.Interface(repayHelperAbi);

  return encodeSingle({
    id: '',
    type: TransactionType.callContract,
    to: REPAY_HELPER_ADDR,
    abi: JSON.stringify(repayHelperAbi),
    functionSignature: contractInterface.getFunction('repayAmount').format(),
    inputValues: {
      to: to,
      cauldron: cauldron,
      amount: bn(amount).toString(),
    },
    value: '0',
  });
}

export function getMimWithdrawTx(amount: BigNumber) {
  let contractInterface = new ethers.utils.Interface(bentoBoxAbi);

  return encodeSingle({
    id: '',
    type: TransactionType.callContract,
    to: DEGENBOX_ADDRESS,
    abi: JSON.stringify(bentoBoxAbi),
    functionSignature: contractInterface.getFunction('withdraw').format(),
    inputValues: {
      token_: MIM_CONTRACT_ADDR,
      from: MIM_TREASURY_ADDR,
      to: MIM_TREASURY_ADDR,
      amount: '0',
      share: bn(amount).toString(),
    },
    value: '0',
  });
}

export function getMimTransferTx(amount: BigNumber) {
  let contractInterface = new ethers.utils.Interface(erc20ABI);

  return encodeSingle({
    id: '',
    type: TransactionType.callContract,
    to: MIM_CONTRACT_ADDR,
    abi: JSON.stringify(erc20ABI),
    functionSignature: contractInterface.getFunction('transfer').format(),
    inputValues: {
      to: SPELL_REWARD_DISTRIBUTOR_ADDR,
      amount: bn(amount).toString(),
    },
    value: '0',
  });
}
