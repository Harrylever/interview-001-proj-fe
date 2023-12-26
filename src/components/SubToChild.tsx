import {useEffect, useState} from 'react';
import {type IChildOption} from '../../types';

const SubToChild = ({list, subId}: {list: IChildOption[]; subId: string}) => {
	const [childOptions, setChildOptions] = useState<IChildOption[]>([]);

	useEffect(() => {
		const filterOptions = list.filter(el => el.subParent === subId);
		setChildOptions(filterOptions);
	}, []);

	return (
		<>
			{childOptions.map((option, _) => (
				<option key={_} value={option.value}>
					{option.name}
				</option>
			))}
		</>
	);
};

export default SubToChild;
