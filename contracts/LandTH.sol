// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

/**
 * @title Land_TH
 * @dev Lands owned by Thai Government agencies
 */
contract LandTH {

    // Struct
    
    struct Org {
        uint id;
        string name;
        string abbr;
    }

    struct Officer {
        address officerAddress;
        string ref;
        string refHash;
        uint orgId;
        bool orgAdmin;
    }

    struct LandType {
        uint id;
        string name;
        string description;
        uint orgId;
    }
    
    struct Land {
        uint id;
        uint landTypeId;
        uint issueDate;
        string geom;
        string updateComment;
    }

    // Event

    event OrgCreated(
        uint id,
        string name,
        string abbr
    );

    event OfficerCreated(
        address officerAddress,
        string ref,
        string refHash,
        uint orgId,
        bool orgAdmin
    );

    event LandTypeCreated(
        uint id,
        string name,
        string description,
        uint orgId
    );

    event LandCreated(
        uint id,
        uint landTypeId,
        uint issueDate,
        string geom,
        string updateComment
    );

    // Mapping

    /* Organizations */
    uint public orgCount;
    mapping(uint => Org) public orgs;
    
    /* Officers */
    mapping(address => Officer) public officers;
    
    /* Land types */
    uint public landTypeCount;
    mapping(uint => LandType) public landTypes;
    
    /* Lands */
    uint public landCount;
    mapping(uint => Land) public lands;

    // Method
    
    constructor() public {

        // ALRO

        addOrg(
            "Agricultural Land Reform Office",
            "ALRO"
        );

        addOfficer(
            0xD048579f9F325df829380c62d9F34AfD9f59670a,
            "6032",
            "bfb9e49eff5aa55fe6c722ef520b71462c6b7a30a3759d023b60ca6d8fbe994e", // sha256('6032' + '9891287329396')
            orgCount,
            true
        );

        // RFD

        addOrg(
            "Royal Forest Department",
            "RFD"
        );

        addOfficer(
            0x4182360aDC813c82F3B35FCABB215a23E0CcC5F6,
            "1290",
            "af71ca1ba3299258cdbd6086b9f3e092980c2e34cb2a5676fb52ff8f4f79c171", // sha256('1290' + '4947256123889')
            orgCount,
            true
        );

        addOfficer(
            0x75c0d3bb6aF7d19Fc5fd41F2dd3bcB94B9Df9980,
            "1322",
            "289329d1e04561cd8f5ed458c144a027144b7d4e239a7cd64d98a5cbb97731c0", // sha256('1322' + '6622004636746')
            orgCount,
            false
        );
    }
    
    /**
     * @dev Add new organization
     * @param _name organization's full name
     * @param _abbr organization's abbreviation
     */
    function addOrg(string memory _name, string memory _abbr) private {
        require(bytes(_name).length > 0, "name must not be empty");
        require(bytes(_abbr).length > 0, "abbr must not be empty");
        orgCount += 1;
        orgs[orgCount] = Org(orgCount, _name, _abbr);
        emit OrgCreated(orgCount, _name, _abbr);
    }
    
    /**
     * @dev Add new officer (private)
     * @param _address officer's address
     * @param _ref officer's reference ID from external database
     * @param _refHash officer's hashed data (for integrity check)
     * @param _orgId officer's organization ID
     * @param _orgAdmin officer's ability to manage the organization
     */
    function addOfficer(
        address _address,
        string memory _ref,
        string memory _refHash,
        uint _orgId,
        bool _orgAdmin
    ) private {
        officers[_address] = Officer(_address, _ref, _refHash, _orgId, _orgAdmin);
        emit OfficerCreated(_address, _ref, _refHash, _orgId, _orgAdmin);
    }
    
    /**
     * @dev Add new officer
     * @param _address officer's address
     * @param _ref officer's reference ID from external database
     * @param _refHash officer's hashed data (for integrity check)
     * @param _orgAdmin officer's ability to manage the organization
     */
    function addOfficer(
        address _address,
        string memory _ref,
        string memory _refHash,
        bool _orgAdmin
    ) public {
        Officer storage officer = officers[msg.sender];
        Officer storage officerToAdd = officers[_address];
        require(officer.orgAdmin == true, "only organizations' administrator can add users");
        require(bytes(officerToAdd.ref).length <= 0, "address already used");
        require(_address != address(0), "address must not be empty");
        require(bytes(_ref).length > 0, "ref must not be empty");
        require(bytes(_refHash).length > 0, "refHash must not be empty");
        addOfficer(_address, _ref, _refHash, officer.orgId, _orgAdmin);
    }
    
    /**
     * @dev Add new land type
     * @param _name land type name
     * @param _description land type description
     */
    function addLandType(string memory _name, string memory _description) public {
        Officer storage officer = officers[msg.sender];
        require(officer.orgAdmin == true, "only organizations' administrator can add land type");
        require(bytes(_name).length > 0, "name must not be empty");
        landTypeCount += 1;
        landTypes[landTypeCount] = LandType(landTypeCount, _name, _description, officer.orgId);
        emit LandTypeCreated(landTypeCount, _name, _description, officer.orgId);
    }
    
    /**
     * @dev Add new land
     * @param _landTypeId land type id
     * @param _issueDate issue date timestamp
     * @param _geom land geometry
     */
    function addLand(uint _landTypeId, uint _issueDate, string memory _geom) public {
        Officer storage officer = officers[msg.sender];
        LandType storage landType = landTypes[_landTypeId];
        require(bytes(officer.ref).length > 0, "only officers can add land");
        require(_issueDate > 0, "issueDate must be greater than 0");
        require(bytes(_geom).length > 0, "geom must not be empty");
        require(bytes(landType.name).length > 0, "land type ID must be valid");
        require(officer.orgId == landType.orgId, "land type must only be created by officer's organization");
        landCount += 1;
        lands[landCount] = Land(landCount, _landTypeId, _issueDate, _geom, "");
        emit LandCreated(landCount, _landTypeId, _issueDate, _geom, "");
    }
}