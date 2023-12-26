import {useEffect, useState} from 'react';
import {type ISubChildOption} from '../../types';

const ChildToSubChild = ({
	list,
	childId,
}: {
	list: ISubChildOption[];
	childId: string;
}) => {
	const [subChildOptions, setSubChildOptions] = useState<ISubChildOption[]>([]);

	useEffect(() => {
		const filterOptions = list.filter(el => el.childParent === childId);
		setSubChildOptions(filterOptions);
	}, []);

	return (
		<>
			{subChildOptions.map((option, _) => (
				<option key={_} value={option.value}>
					{option.name}
				</option>
			))}
		</>
	);
};

export default ChildToSubChild;
