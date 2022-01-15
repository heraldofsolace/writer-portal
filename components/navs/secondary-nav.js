
export default function SecondaryNav({currentPage}) {
    return (
        <div className="pure-menu pure-menu-horizontal">
            <ul className="pure-menu-list">
                <li className={currentPage === 'assignments' ? 'pure-menu-item pure-menu-selected' : 'pure-menu-item'}>
                    <a href={"/"} className="pure-menu-link">Your Assignments</a>
                </li>
                <li className={currentPage === 'available' ? 'pure-menu-item pure-menu-selected' : 'pure-menu-item'}>
                    <a href={"/assignments/available"} className="pure-menu-link">Available Assignments</a>
                </li>
            </ul>
        </div>
    );
}
