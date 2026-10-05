const SkillCard = ({ skill }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold">{skill.name}</h3>
            <p className="text-gray-600">{skill.description}</p>
            <a 
                href={skill.resource} 
                className="text-blue-500 hover:underline mt-2 block"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn More
            </a>
        </div>
    );
};

export default SkillCard;
