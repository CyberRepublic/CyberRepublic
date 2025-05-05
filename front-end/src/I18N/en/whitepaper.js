export default {
  abstract: {
    title: 'Abstract',
    body: `<p>In reflecting on historical community dynamics in the blockchain industry’s short history, we have identified that blockchain projects present a number of unique challenges that differentiate them from traditional Internet products; these issues are rooted and manifest in the realm of community governance. To resolve these challenges, we introduce a mechanism to achieve consensus across the entire Elastos community based on a delegate model. This mechanism enables community members to participate in decision-making through an electoral process. Besides, it incentivizes community members to contribute to community and ecosystem development by submitting proposals. All participants in consensus use digital signatures to confirm their actions and record those actions on the Elastos blockchain. The open, transparent, and immutable features of blockchain technology allow all community members to participate fairly. In addition, the design of proposal categories makes feasible more application scenarios and a broader development space for the consensus mechanism of Elastos community governance.</p>`
  },
  '1': {
    title: '1. Elastos DAO (DAO)',
    body: `<p>Elastos DAO (DAO) is the community that has naturally formed around Elastos. DAO consists of ELA token holders, Elastos Foundation members, Elastos ecosystem partners, and any other teams and individuals that contribute to developing Elastos’ technologies and community.</p>`
  },
  '2': {
    title: '2. Elastos DAO Consensus (PoI)',
    body: `
      <p>The Elastos DAO Consensus is the third Elastos consensus mechanism after PoW and BPoS. The purpose of PoI is to provide a consensus-based community governance mechanism that will drive Elastos’ technological and ecosystem development, dispute resolution, and management of community assets, and establish incentives to foster community participation in the governance of and contribution to the Elastos community.</p>
      <p>The PoI can be viewed as the DAO community's top-level governance model, but it is not intended to become a closed off, tightly knit, or compulsory organizational structure for the community; openness, dispersion, and spontaneity are essential characteristics of the community. Rather, the purpose of the PoI is to guide the process of grassroots growth through the power of collective decision making, and to provide assistance when necessary.</p>
      <p>Additionally, the PoI is the basic infrastructure for developing the Elastos DApp ecosystem, as it provides a general community governance mechanism for truly decentralized applications.</p>`
  },
  '3': {
    title: '3. Motivation',
    body: `
      <h3>3.1. The Unique Features of Public Blockchains</h3>
      <p>Blockchain development’s short history has already involved a number of significant intra-community disputes. Though often well-intentioned and thorough, attempts to mediate such disputes failed to achieve meaningful resolutions, and resulted in divisive hard forks - most notably that between BTC and BCH, which led to the break-up of the community. In reflecting on these divisions, it is important to acknowledge the unique characteristics that distinguish developing blockchain projects from traditional products being developed for the present internet:</p>
      <ol>
        <li><span>1)</span>For blockchain projects, community is the driving force for development because the blockchain is different from other products. The blockchain is the shared property of the community, and should not be controlled by any one group or entity.</li>
        <li><span>2)</span>Within a blockchain community, consensus is not easily achieved, as various members and team may have different values and ideas.</li>
        <li><span>3)</span>Blockchain technology development can be slow. Two years elapsed between the Bitcoin Network’s initial scalability dispute and the final completion of its hard fork, whereas a similar upgrade to a traditional internet product would only take a few weeks.</li>
      </ol>
      <p>The reality of the present state of the blockchain industry is as follows: it is only ten years in development, and community and dApp ecosystems are still lacking in robustness, particularly in contrast with the platforms of the traditional internet.</p>

      <h3>3.2. Mechanism for Community Decision Making</h3>
      <p>Additionally, many are familiar with BTC's Bitcoin Improvement Proposal (BIP) and ETH's Ethereum Improvement Proposal (EIP). These efforts aimed to advance each blockchain's respective process of technological development. However, the power to decide whether to adopt the improvement proposal was ultimately in the hands of the core development team. In these systems, the voices of core developers carried significant weight in addressing matters related to project development. Such imbalances highlight the centralized nature of this style of governance, which is incompatible with the values held by the blockchain paradigm.</p>
      <p>With regard to public blockchains, the code is the consensus. There should be no team with the ability to exercise control by editing the code at will. Because the Elastos blockchain is a public blockchain, the launch of BPoS consensus signified the full decentralization of Elastos, as it prevented the Elastos Foundation from changing the blockchain code at will. Of course, such decentralization also makes it more difficult for a blockchain technology to evolve or to undergo upgrades.</p>
      <p>Technical upgrade efficiency represents only one aspect of blockchain programmatic governance that has yet to be solved. There are still many others decisions to be made related to community decisions that require community participation, such as altering economic models or benefit allocation methods. These are dilemmas that cannot be solved by on-chain consensus alone.</p>
      <p>There is a true need to utilize and reach a community consensus regarding these challenges. Rather than relying on a portion of existing work groups or factions to represent everyone during the decision making process, we must utilize blockchain technology to form and facilitate true community consensus.</p>

      <h3>3.3. Ecosystem Development and Community Contribution</h3>
      <p>Decentralization is both an important value and technical characteristic of blockchains that ensures that power is decentralized (i.e., the control and operational power that the founding group has over the product). As such,​ ​the decentralization of power inevitably induces a decentralization of responsibility​.</p>
      <p>Imagine a completely decentralized community: who would be responsible for expanding the community and for developing the app ecosystem? Completely relying on the spontaneity of community members necessitates that a lack of motivation would cause the development process to be extremely slow, and is a problem that the entire blockchain industry faces.</p>
      <p>For this reason, we must incentivize individuals and groups to make contributions to the DAO community and Elastos ecosystem based on the formation of community consensus. This will attract more people to join the community and become contributors, and accelerate the promotion of community and Dapp ecosystem development.</p>
      <p>In order to solve the aforementioned challenges involving community decision-making and contributor incentives by integrating Elastos blockchain technology, we propose the third Elastos consensus mechanism: PoI.</p>`
  },
  '4': {
    title: '4. Basic Principles of PoI',
    body: `
      <p>The goal of PoW and BPoS consensus is to securely and effectively record transactions on a blockchain ledger. Comparatively, the objective of PoI is to make community decisions using a consensus mechanism which draws on humans rather than computers and machines. Simply put, the PoI is a consensus mechanism in which humans - in particular, ELA holders - act as nodes, both by submitting proposals and voting on their outcomes to carry out community governance.</p>
      <p>The problem here is that purely on-chain consensus mechanisms like BPoS or PoW have a very clear objective: record transactions and blocks on the blockchain. But the objective of the PoI is not necessarily clearly defined because "community affairs" are often broad and ambiguous, and thus decisions must be made by human beings.</p>
      <p>Because the community’s scope and scale are ever-evolving and difficult to define, it is not possible for each community member to have the right to put forth a community proposal calling for the entire community’s consensus. As such, it is necessary to reduce the size of the group in possession of those powers by utilizing a delegate mechanism. First, the community will vote to elect a certain number of delegates; then the delegates will recommend proposals and vote on them. The delegates and their behaviors relating to the proposals’ recommendations will be supervised by the community via blockchain technology.</p>
      <p>The PoI’s democratic form of consensus is analogous to BPoS, where delegate elections can be likened to Supernode elections: humans vote to elect Council members based on their ELA tokenholdings, and utilize the blockchain as a trustless implementation mechanism. With regard to their functionalities, the greatest difference between the PoI Delegates and BPoS Supernodes is that PoI delegates are imbued with the power to raise and recommend community proposals at will.</p>
      <p>It is of the highest priority that the blockchain's properties of openness, transparency, and immutability are successfully transferred to the human-operated processes of PoI. Thus, PoI delegate elections, proposal submissions and voting, implementation tracking, and all other processes must take place through blockchain transactions that are controlled by PoI blockchain code, meaning that they must use a digital signature to verify their identity. Community members can easily participate and supervise consensus progress using clients that support the PoI (a "client" refers to any blockchain client that supports PoI).</p>`
  },
  '5': {
    title: '5. Two Major Roles of the PoI',
    body: `
      <p>First we must clearly define the two major roles in the DAO community.</p>

      <h3>5.1. Elastos Council Member</h3>
      <p>A delegate elected by community vote during a blockchain election. According to the PoI, Elastos Council Members act as the "Supernodes" for all community members and make decisions related to community affairs. Their rights and responsibilities are as follows:</p>
      <ol>
        <li><span>1)</span>The rights and responsibilities that all normal community members have;</li>
        <li><span>2)</span>The right to recommend proposals - that is, to put forth potential proposals originating from within the community (see: 7.1.);</li>
        <li><span>3)</span>The right to vote on proposals - that is, the right to vote for, against, or to abstain from voting on proposals.</li>
      </ol>

      <h3>5.2. Community Members</h3>
      <p>All token holders in the DAO community. Their rights and responsibilities are as follows:</p>
      <ol>
        <li><span>1)</span>The right to vote in elections: the right to cast votes in support of any candidate running for Elastos Council Member.</li>
        <li><span>2)</span>The right to be elected - that is, the right to run in the election for Elastos Council Member.</li>
        <li><span>3)</span>The right to submit proposals to Elastos Council Members, who can recommend them as official PoI proposals, if they so choose.</li>
        <li><span>4)</span>The right to monitor the behaviors of Elastos Council Members and to vote to impeach them. Each community member can monitor the behaviors of Elastos Council Members and can vote to impeach Council Members who they find unfit.</li>
        <li><span>5)</span>The right to supervise the proposal process and to object to proposals. Community members can monitor the entire proposal process using the client, including the status of both voting and implementation. Proposals from Elastos Council Members that pass Elastos Council voting will be subject to a public referendum, during which time community members can object to proposals through community vote.</li>
      </ol>
      <p>These roles and processes do not necessitate the establishment of any additional roles or councils, including those designed for legal or supervisory purposes. Elastos Council Members may arbitrate community disputes by raising proposals, which itself includes the powers of a court. The processes of voting and raising proposals both operate on the blockchain, and all community members can monitor and affect the implementation of this process through the client by collectively voting against proposals or by impeaching council members.</p>
      <p>The blockchain’s intrinsic characteristics of openness, transparency, and immutability expedite the transmission of information, thus simplifying the process of achieving community consensus without requiring excessive bureaucracy and representation.</p>`
  },
  '6': {
    title: '6. Elastos Council',
    body: `
      <h3>6.1. Elastos Council</h3>
      <p>The Elastos Council is presently comprised of 12 seats which are filled by a community election conducted on the blockchain. As the community expands, the number of Council Members might change, though such a change would require that a consensus be reached by the community through PoI.</p>
      <p>The Elastos Council differs from normal councils and boards of directors in that it is a distributed body of individuals. In principle, the Elastos Council Members do not need to know each other, communicate with each other, or have common goals because all consensus actions revolve around proposals and voting. The Elastos Council is not a regular organization per se, but a decentralized entity whose collective decision making is facilitated by blockchain in much the same way Supernodes operate within BPoS consensus.</p>
      <p>The Elastos Council is represented by a permanent ELA wallet address set in the blockchain code. The ELA available to the current Elastos Council is stored at this address (see: 9.3.).</p>

      <h3>6.2. Election Rules</h3>
      <p>All community members that intend on participating in the Elastos Council Election must have Elastos DIDs. They can issue the election participation transaction in their wallets to notify the community of their participation in the Elastos Council Election and to make a 5,000 ELA deposit to verify their eligibility to participate. If a participant is not elected, the original deposit will be returned to him or her in full.</p>
      <p>Elastos Council Members are elected through a voting process using ELA. All voting information will be recorded in real time on the blockchain and reflected in the client. At the time that voting concludes, the top 12 candidates who have obtained the most votes will become Elastos Council Members.</p>

      <h3>6.3. Impeachment of Council Members</h3>
      <p>As Elastos Council Members serve their term, community members can at any time vote to impeach council members with whose performance they are unsatisfied. Once the number of votes to impeach a council member exceeds the equivalent of 20% of the circulating supply of ELA (the ELA circulating supply is defined as ELA outside of the DAO assets address (see: 9.3.)), the impeached member will be automatically removed from the council.</p>

      <h3>6.4. Rewards</h3>
      <p>Being elected as a Elastos Council Member is an honor and a privilege, and it also carries the responsibility to govern the community and develop the Elastos ecosystem. In order to incentivize Elastos Council Members to better perform their roles, the Elastos BPoS Consensus has reserved the right for each Elastos Council Member to operate his or her own BPoS Supernode, which is also a responsibility and an obligation. This Supernode is an automatically active node; because it is not elected by voting, it does not receive voting rewards.</p>

      <h3>6.5. Term in Council</h3>
      <p>Generally, Elastos Council Members serve a term of one year (specifically, the time period of 262,800 main chain blocks). One month prior to the conclusion of the term (the time period of 21,900 main chain blocks), a new Elastos Council Member Election will be automatically initiated.</p>
      <p>If a Elastos Council Member is successfully impeached, that council member will automatically be removed from council, and will be stripped of his of her roles and responsibilities.</p>
      <p>Additionally, if a Elastos Council Member's BPoS Supernode goes into Inactive status, then his or her roles and responsibilities will be temporarily suspended until the BPoS Supernode returns to Active status. If a Elastos Council Member's BPoS Supernode goes into Illegal status, then that Council Member will also be removed from the council.</p>
      <p>When the number of Elastos Council Members is less than 2/3 of the total number of available seats, Council Member Elections will be automatically initiated.</p>

      <h3>6.6. Number of Votes</h3>
      <p>The quantity of ELA held by a community member is equal to the number of votes that member has the right to cast, and is not necessarily an integer.</p>
      <p>During an election, a tokenholder's votes can be cast for one or more candidates, based on the tokenholder’s preferences. The right to vote may also be used to impeach a council member or to vote against community proposals approved by the Elastos Council (see: 7.3.). Votes are calculated independently based on different voting scenarios, and can be reused.</p>
      <p>For example, if a tokenholder has 18.5 ELA, then that member has the right to cast 18.5 votes during an election. Such a tokenholder may cast 10 votes for Candidate A, and cast the other 8.5 votes for Candidate B. In addition, the voter can also use a maximum of 18.5 votes to impeach a current Council Member. Of course, when voting to impeach council members, votes cannot be reused, meaning that votes cast to impeach Council Member A cannot also be cast to impeach Council Member B. None of these voting practices will affect the 18.5 votes that this tokenholder may cast during BPoS Elections.</p>
      <p>Note that when tokenholders conduct transactions using ELA, the number of votes they may cast will be affected. If a certain transaction causes a tokenholder's remaining number of votes to fall below the number of votes cast in a certain voting scenario, then that tokenholder's votes are canceled.</p>

      <h3>6.7. Making and Returning the Deposit</h3>
      <p>During a term in council, a Elastos Council Member must make a deposit of 5,000 ELA. The 5,000 ELA deposit will also be used as each Council Member's Supernode deposit, which is a requirement of all Supernodes, and is forfeited in the case that malicious activity is committed by that node.</p>
      <p>After the conclusion of a council member’s term (including cases of replacement during election and successful impeachment), an amount will be deducted from the ELA on deposit according to the ratio of the term that is not served and the number of proposals on which the Council Member failed to vote. The remaining sum of ELA will be returned to the council member's wallet. If a Elastos Council Member is removed from council because the member’s Supernode enters Illegal status, then the full amount of the ELA on deposit will be forfeited.</p>
      <p>Suppose that a council member performed their duties normally until the ensuing election. For the duration of the member’s term, there were ​M ​number of proposals of which the council member voted on N number of proposals. The remaining amount on deposit is expressed as ​P (it is possible for the value of P to be reduced to less than 5,000 ELA in case of malicious activity committed by the BPoS Supernode). Then, the amount of the deposit to be returned is calculated as follows:</p>
      <p>R = P * (N / M)</p>
      <p>If the Council Member leaves his or her post early due to impeachment, suppose that the real block duration that member served in council is ​T.​ The deposit that should be returned is calculated as follows:</p>
      <p>R = P * (T / 262,800) * (N / M)</p>
      <p>The amount of the deposit forfeited will be permanently removed from circulation - the equivalent of being burned.</p>`
  },
  '7': {
    title: '7. Proposals',
    body: `
      <p>Proposals are subjects that need to go through the process of PoI. A PoI proposal will normally include the following elements:</p>
      <ul>
        <li>The subject as it pertains to the DAO community and Elastos technology development;</li>
        <li>The problem it intends to solve and the goals it aims to achieve;</li>
        <li>A specific method and process for reaching the goal;</li>
        <li>The person or team designated to implement the proposal;</li>
        <li>The anticipated period of time required for implementation and corresponding checkpoints; and</li>
        <li>A budget for expenses and an expenditure plan - if required.</li>
      </ul>
      <p>All proposals after being recommended by Elastos Council Members will be structured as proposal transactions recorded on the blockchain, to be voted on by Elastos Council Members.</p>

      <h3>7.1. The Right to Submit a Proposal</h3>
      <p>All community members who use and disclose Elastos DIDs can submit a proposal to the Elastos Council members. The proposal's author needs to sign the proposal with his or her private key, and the content of the proposal cannot be changed. Then, the Elastos Council Member can recommend it to the Elastos Council or reject it.</p>

      <h3>7.2. The Right to Introduce a Proposal</h3>
      <p>Elastos Council Members sign a proposal with their private keys to recommend it. In the case where Elastos member is the proposal’s author the two signatures may be from the same individual. Once the Elastos Council Member has signed the proposal, it becomes an official proposal for the PoI, leaving it to be published on the blockchain and subject to a vote by Elastos Council Members when the consensus process begins.</p>
      <p>A single Elastos Council member can recommend no more than 128 proposals during his or her term of service. During a Elastos Council election, current Elastos Council Members will not be able to raise new proposals. However, they may still vote on proposals with voting in progress.</p>

      <h3>7.3. Voting and Notification</h3>
      <p>After a proposal is raised, Elastos Council Members will have a time period of 5,040 main chain blocks (approximately seven calendar days) to vote on the proposal via a wallet signature on the proposal transaction; each person has one vote. At the time when the voting period concludes, if the proposal obtains a minimum of 2/3 of total number of seats in the affirmative, then the proposal passes the vote by the Elastos Council (see: 6.5). Proposals that do not pass voting are invalid.</p>
      <p>After a proposal passes voting by the Elastos Council, a public referendum spanning a time period of 5,040 main chain blocks (approximately seven calendar days) ensues. During the notification period, all community members can vote against proposals they oppose. Once the number of votes against a proposal exceeds the equivalent of 10% of all circulating ELA, the proposal becomes invalid. A single vote can be used against multiple proposals.</p>
      <p>If a proposal passes voting and the ensuing Public Referendum, the proposal becomes valid, and can be implemented.</p>

      <h3>7.4. Proposal Categories</h3>
      <p>Some proposals require consensus code to carry out particular rules and conditions. For this reason, it is necessary to categorize proposals in order to identify each by code. These proposal categories include, but are not limited to the following:</p>
      <ul>
        <li>Code upgrades</li>
        <li>Additions of sidechains</li>
        <li>Replacing a Proposal Owner (see: 7.7.)</li>
        <li>Terminate a proposal (see: 7.9.)</li>
        <li>Proposals for new Elastos Council Secretary General (see: 8.1.)</li>
      </ul>
      <p>In addition to categories for special proposals related to the basic infrastructure of consensus, certain heavyweight DApps can also apply to Elastos Council for proposal categories used for DApp consensus governance. For example, developers at DEX (a decentralized exchange) can apply to the Elastos Council for a proposal category for decisions regarding the listing of new tokens.</p>
      <p>PoI proposal categories will be maintained and published via an informational ELIP (Elastos Improvement Proposal).</p>

      <h3>7.5. Elastos Council Secretariat</h3>
      <p>While many proposals will seamlessly pass the consensus process and have short implementation periods, others will be rather complex, and produce the following challenges:</p>
      <ul>
        <li>Long implementation periods requiring tracking, supervision, and adjustments;</li>
        <li>Rationale requiring professional insight to judge the proposal;</li>
        <li>Trivialities requiring an excessive number of revisions.</li>
      </ul>
      <p>Ideally, it is possible to solve the problems described above by frequently submitting proposal revisions and drawing on past experience. However, in reality the constraints of time, capital, and communication costs are significant, and these revisions will likely prove too burdensome for Elastos Council Members, as administrative tasks will weigh upon their workload.</p>
      <p>For this reason, the Elastos Council needs a supportive body to assist with decision making, implementation, tracking, and management of daily decisions and tasks. This body will be referred to as the Elastos Council Secretariat, which will be headed by a Elastos Council Secretary General.</p>

      <h3>7.6. Proposal Owner and Implementation Tracking</h3>
      <p>The original author of the proposal is also the default owner of the proposal. After the proposal has passed the PoI (including the public referendum), the Proposal Owner has the responsibility to track and provide feedback about the proposal’s implementation status in order to reach a consensus with the Elastos Council Secretariat regarding said implementation status. In more detail, the Proposal Owner submits the tracking messages of the proposal and the Secretariat reviews and verifies regarding the said implementation status, and then the consensus process between the Proposal Owner and the Secretariat can be complete.</p>
      <p>Tracking messages about proposal implementation will be published to the blockchain after the Proposal Owner and the Elastos Council Secretariat both sign the transaction, serving to make public ancillary information about the proposal. The quantities of the tracking messages for a single proposal cannot exceed 128.</p>

      <h3>7.7. Replacing the Proposal Owner</h3>
      <p>In certain circumstances, the Proposal Owner may be unable to carry out the responsibility of tracking the proposal. In such cases, one of the following two methods may be used to replace the Proposal Owner:</p>
      <ol>
        <li><span>1)</span>The original Proposal Owner submits a request to replace himself or herself. The request includes the signature of the original owner and the candidate owner of the proposal. After the Secretariat approves and signs the request, it establishes a consensus along with the original owner and the new owner (formerly the candidate owner). The request will be published on the blockchain as a three-party joint signature transaction. This is a lightweight update method based on the premise that the original Proposal Owner is still able to manage basic responsibilities and is willing to take the initiative to replace the Proposal Owner;</li>
        <li><span>2)</span>The candidate for the Proposal Owner submits a proposal to replace the current Proposal Owner to the Elastos Council. This method is relatively “heavyweight,” and is better suited to cases where the original Proposal Owner is unable or is unwilling to manage any responsibilities. Prior to submitting proposals, the Elastos Council Members or the Secretariat must conduct offline discussions with the team responsible for the implementation of the proposal and confirm the new candidate for Proposal Owner.</li>
      </ol>

      <h3>7.8. Budget and Payment</h3>
      <p>If the implementation of a proposal requires funding denominated in ELA, a detailed budget and expenditure plan should be included in the proposal along with a specified ELA address where the funds are to be sent.</p>
      <p>The expenditure plan typically lists one or more installments that correspond to the checkpoints in the proposal. The first installment will be approved along with the proposal. For the remaining installments, specific criteria for approval should be attached. While the proposal is being implemented, the tracking messages will be used as the basis for approval of upcoming installments. In other words, the approval of future installments only requires consensus between the Proposal Owner and the Secretariat. Therefore, a proposal with a multi-phase installments is generally only applicable to proposals with small periodic installments.</p>
      <p>When the Elastos Council members believe that the phased project is important or the requested ELA in the expenditure plan is large, the Proposal Owner should submit proposals for each phase separately, which enables more people to participate in the consensus on budget approval and implementation status.</p>
      <p>For approved expenditures in a proposal, the Proposal Owner can withdraw ELA from the Elastos Council Expense Address to the receiving address specified in the proposal during the term of the current Elastos Council.</p>

      <h3>7.9. Conclusion/Termination of a Proposal</h3>
      <p>After the proposal is completed, the Proposal Owner sends a request to the DAO Secretariat to finalize the proposal. After the Secretariat verifies and approves it, they arrive at consensus to conclude the proposal. The request to end the proposal will be posted on the blockchain with a joint-signature transaction, and will be available to the community as subsidiary information of the proposal.</p>
      <p>When the proposal is being implemented, there may be situations where a proposal cannot or is not supposed to continue. In these scenarios, the proposal should be terminated with a new proposal that is categorized in 7.4.</p>
      <p>The consensus process for approving a new proposal in order to terminate a previous proposal is consistent with the consensus process for regular proposals. After the proposal is approved, the blockchain code will automatically execute it, thus terminating the previous proposal. No further tracking messages are required for the proposal.</p>

      <h3>7.10. Status and Process</h3>
      <p>Beginning with the submission of a proposal to the Elastos Council, the consensus statuses and process are as follows:</p>
      <img src="/assets/images/whitepaper.png" width="100%" alt="">
      <ul>
        <li><strong>Submitted:</strong> A proposal’s status after the Proposal Owner completes the proposal and signs it. Proposals in this state cannot be public on the blockchain, which means that decentralized clients cannot see such proposals from the community.</li>
        <li><strong>Council </strong>Voting: A proposal that has been recommended by the Elastos council member(s) and in the voting period. The proposal contains two signatures: the signature of the Proposal Owner and the signature of the person who recommends the proposal. This is an official PoI proposal posted on the blockchain.</li>
        <li><strong>Community </strong>Review: A proposal that has entered the public referendum after the approval of the Elastos council.</li>
        <li><strong>Tracked:</strong> After the notification period, a proposal that enters the implementation period during which the implementation of the proposal is conducted. For some proposals that are automatically executed by blockchain code, this status may not be applicable.</li>
        <li><strong>Finalized:</strong> The final status of a proposal. This status generally indicates that the proposal has achieved the desired goal.</li>
        <li><strong>Rejected:</strong>​ A proposal that is rejected during the voting period or public referendum.</li>
        <li><strong>Canceled:</strong> A proposal that is terminated before it becomes finalized, despite earning approval from the Elastos Council.</li>
      </ul>
      <p>A proposal is to be regarded as a public contract between the Proposal Owner and the DAO community. Community consensus will be confirmed after the proposal is approved by the Elastos Council. All DAO members are to comply with the content of the proposal.</p>`
  },
  '8': {
    title: '8. Elastos Council Secretariat',
    body: `
      <h3>8.1. Method of Selection</h3>
      <p>The Elastos Council can propose and elect a new Elastos Council Secretary General - leader of the Elastos Council Secretariat - through the proposal process. Then, a proposal for an organizational plan will be put forth by the Elastos Council Secretary General in order to establish a new Elastos Council Secretariat.</p>
      <p>The Elastos Council Secretary General must use and publicize his or her Elastos DID, and must commit to using and publicizing a single ELA wallet address.</p>

      <h3>8.2. Rights and Responsibilities</h3>
      <p>The Elastos Council Secretariat reports to the Elastos Council. The DAO Secretariat’s responsibilities are defined by a proposal approved by the Elastos Council during the Elastos Council Secretary General election. Under normal circumstances, such responsibilities may include, but are not limited to, the following:</p>
      <ul>
        <li>Submit a work plan and budget for the current Secretariat to the new Elastos Council Members after a new Elastos Council is elected;</li>
        <li>Submit a Summary of Work and a Final Financial Statement to the Elastos Council before a Elastos Council election begins. Otherwise, submit the Summary of Work and Final Financial Statement to the new Elastos Council after the Elastos Council election ends.</li>
        <li>Maintain Elastos Council operations, such as DAO website maintenance and improvement;</li>
        <li>Convene necessary meetings according to the requirements of Elastos  Council Members;</li>
        <li>Hire professionals of specific expertise to assist with the decision making process and write evaluation reports on proposals according to the requirements of the council;</li>
        <li>Review tracking and implementation for proposals and submit revised proposals when necessary;</li>
        <li>Assist Council Members who have such requirements to operate and maintain their Supernodes (for which the Secretariat shall charge for the costs of operation and maintenance);</li>
        <li>Maintain informational ELIPs about the PoI;</li>
      </ul>
      <p>As a subsidiary body of the Elastos Council, the Elastos Council Secretariat's main purpose is to support the operations of the Elastos Council. Community and ecosystem development are not within its scope of responsibility.</p>

      <h3>8.3. Term of Service</h3>
      <p>In order to maintain the continuity of proposal implementation, the Elastos Council Secretariat is not replaced following a Elastos Council election. When Elastos Council members believe that there is a better choice for Elastos Council Secretary General, they may raise a proposal to nominate a new Elastos Council Secretary General.</p>`
  },
  '9': {
    title: '9. DAO Community Assets',
    body: `
      <h3>9.1. Necessity</h3>
      <p>Some blockchain projects lose momentum after the rapid development experienced during the early stages and later devolves into stagnation. Because these projects have already completed their initial goals and the token allocation model is complete, a community without a perpetual economic incentive will lose the original drive of project development and expansion.</p>
      <p>Hence, it is necessary to maintain community assets of a certain scale; in most cases, implementing a community consensus will require the support of tokens, independent of whether that involves Elastos Council operations, Elastos Improvement Proposals, or proposals for community events, as all will require an economic incentive.</p>

      <h3>9.2. Source of Funds</h3>
      <p>DAO Community assets arise primarily come from three sources:</p>
      <ol>
        <li><span>1)</span>Donations made by community teams or individuals;</li>
        <li><span>2)</span>The annual 1.2% increase in issuance of ELA;</li>
        <li><span>3)</span>Returns on investments, including ecosystem projects and foundations.</li>
      </ol>
      <p>Stemming from blockchain management requirements and safety considerations, the DAO community assets are restricted to ELA; other digital assets should be exchanged into ELA using the buyback method.</p>
      <p>After these assets have been received, they will be stored at a public address called the DAO Assets Address. This is the address of a special ELA Wallet whose rules of use are written into the blockchain code.</p>

      <h3>9.3. Rules</h3>
      <p>DAO community assets are controlled by two special ELA wallet addresses which are labelled DAO Assets and Elastos Council Expenses, respectively. Their addresses are open to the entire community and are controlled by the blockchain code.</p>
      <p>The total assets jointly held by the DAO community are stored within the DAO Assets Address. This wallet’s terms of use are set in the blockchain code. After each Elastos Council election has concluded, the new Elastos Council can withdraw 10% of the present wallet balance from DAO Assets Address to the Elastos Council Expenses Address.</p>
      <p>The ELA stored in the Elastos Council Expenses Address are used to support the operations of the current Elastos Council, and are under the control of blockchain code related to PoI proposals. The ELA at this address can only be approved to paid out and put into circulation through a proposal, and the Elastos Council is unable to create a transaction to transfer assets out independently.</p>
      <p>The maximum amount that may be utilized by an individual proposal is set to 10% of the Elastos Council Expenses Address, as measured at the beginning of the current Elastos Council term.</p>`
  },
  '10': {
    title: '10. Future Outlook',
    body: `
      <p>PoI not only is a consensus-based community governance mechanism, but is one of the most important pieces of infrastructure in the Elastos ecosystem. Together with PoW and BPoS, it lays a strong foundation for truly decentralized applications and services.</p>
      <p>By expanding the categories of proposals, PoI’s range of functions span not only across the blockchain sector, but to various areas including Elastos technology-based sidechains, cross chains, decentralized exchanges, decentralized gaming, digital asset management, and decentralized e-commerce.</p>
      <p>Further expanding on the proposal categories, a new category that may potentiate is one designated exclusively to Smart Contracts. Unlike traditional open smart contracts that can be deployed unlimited. PoI Smart Contract Proposals must be signed by Elastos Council Members and the Proposal Owner, and monitored by the entire community. Such a process provides strong protection for the utility and security of Smart Contract Proposals.</p>`
  },
  A: {
    title: 'Appendix A. Contents not Covered in the Whitepaper',
    body: `
      <h3>A.1. Provisions on the roles of the PoI</h3>
      <p>This whitepaper addresses only the fundamental requirements for the individuals occupying essential roles in PoI, including but not limited to: Elastos Council Members, Secretariat, and Proposal Owners. It also describes the fundamental restrictions on the actions taken by these roles in the implementation of PoI. In reality, more restrictions may be placed on these roles as required by various scenarios.</p>
      <h3>A.2. Formatting the content of a proposal</h3>
      <p>The Implementation of some proposals requires automatic execution by blockchain code; therefore, it is necessary to format the proposal and its ancillary tracking messages. These designs should be defined and improved via ELIP.</p>
      <h3>A.3. Code design and implementation of PoI</h3>
      <p>The PoI is implemented by Elastos blockchain code; therefore, the detailed technical rationale and specifications shall be defined and improved by ELIP.</p>
      <h3>A.4. Clients that support PoI</h3>
      <p>Clients that claim to support PoI must follow the interface specifications of PoI in the Elastos blockchain, which are defined by the relevant ELIP. On this basis, Clients can be optimized as needed in order to improve elements of user experience. For example blockchain full node and cache services can be built in order to improve client response times.</p>
      <h3>A.5. Subordinate bodies of the Elastos Council</h3>
      <p>In the whitepaper, only the Elastos Council Secretariat is defined as the Elastos Council’s subordinate body for it acts an important role in PoI. However, this does not mean that the Elastos Council cannot establish other subordinate bodies. For example, a proposal can be implemented to establish a Technical Standards Committee. Upon the approval of the proposal, the Technical Standards Committee can review Elastos technical standards, thus improving the interoperability of platforms and services in the Elastos ecosystem.</p>`
  },
  B: {
    title: 'Appendix B. Improvements to PoI',
    body: `
      <h3>B.1. Whitepaper</h3>
      <p>The PoI whitepaper is currently maintained by the Elastos Council and Secretariat Team. The workgroup can be reached via email at secretariat@cyberrepubli.org, and any suggestions pertaining to the whitepaper should be forwarded to this email address.</p>
      <h3>B.2. Related ELIPs</h3>
      <p>ELIP (Elastos Improvement Proposal) is a PoI proposal category designated to the developer community that aims to promote improvements in Elastos’ technical infrastructure. The ELIP-1 (ELIP Purpose and Guidelines), which defines and outlines ELIP, is presently in the draft stage.</p>
      <p>The PoI-related ELIP numbers and titles should be included in this appendix for reference purposes.</p>`
  }
}
