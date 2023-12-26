import {useEffect, useState} from 'react';
import {type IChildOption, type ISubOption} from '../../types';
import {SubToChild} from '.';

const MainToSub = ({list, listTwo, mainId}: {list: ISubOption[]; listTwo: IChildOption[]; mainId: string}) => {
	const [subOptions, setSubOptions] = useState<ISubOption[]>([]);

	useEffect(() => {
		const filterOptions = list.filter(el => el.mainParent === mainId);
		console.log(filterOptions);
		setSubOptions(filterOptions);
	}, []);

	return (
		<>
			{subOptions.map((option, _) => (
				<option key={_} value={option.value}>
					&nbsp;&nbsp;&nbsp;&nbsp;{option.name}
				</option>
			))}
			<SubToChild list={} />

		</>
	);
};

export default MainToSub;
