// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';

import { TARGET } from '../constants';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { ChainTypes } from '../types/sourceTargetTypes';

interface Output {
	local: string,
	destination: string;
}

export default function useDashboardProfile(chainType: ChainTypes): Output {
	const {
		sourceChain, targetChain
	} = useSourceTarget();

	const [profile, setProfile] = useState({ destination:'',local: '' });

	useEffect(() => {
		let local = sourceChain;
		let destination = targetChain;
		if (chainType === TARGET) {
			local = targetChain;
			destination=sourceChain;
		}
		setProfile({ destination,local });
	}, [chainType, sourceChain, targetChain]);

	return profile;

}