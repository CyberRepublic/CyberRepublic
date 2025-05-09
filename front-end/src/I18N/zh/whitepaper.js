export default {
  abstract: {
    title: '摘要',
    body: `<p>通过对区块链历史中发生过的社区事件以及现实的分析，我们针对有别于传统互联网项目的社区治理问题，提出了基于社区代理人凝聚亦来云社区共识的治理机制。该机制让社区成员可以通过投票表决参与社区决策，还能激励社区成员以提案方式参与社区和生态贡献。所有参与共识的个体都使用数字签名确认其行为，并通过亦来云区块链记录和公示。区块链公开、透明以及不可更改的特性让所有社区成员都可以公平的参与其中。此外，对提案类别的设计，可以为亦来云社区治理的共识系统带来更多的应用场景和更广阔的发展空间。</p>`
  },
  '1': {
    title: '1. Elastos DAO (DAO)',
    body: `<p>DAO 是亦来云社区的统称，名字表达了对亦来云社区发展的美好愿景。DAO 由亦来云持币人和贡献者组成，包括创始团队亦来云基金会、生态合作伙伴以及其它愿意为亦来云技术和社区发 展做出贡献的个人和团队。</p>`
  },
  '2': {
    title: '2. Elastos DAO Consensus (PoI)',
    body: `
      <p>PoI 是继 PoW 和 BPoS 之后亦来云的第三种共识，其目的是为 DAO 提供一种基于共识的社区治理机制，以持续推动亦来云技术开发和生态发展，解决争议，管理社区资产，激励社区成员参与社区的治理和贡献。</p>
      <p>PoI 可以看做是 DAO 社区的顶层设计，但 PoI 无意于把社区变成一个传统意义上相对封闭、紧凑以及强制型自上而下管理的完整组织架构，因为社区的本质特性是开放、松散和自发型自底向上生长。 PoI 让社区自底向上的生长过程有一个向心力的引导，以扶持和促进社区发展。</p>
      <p>此外，PoI 也是亦来云发展 DApp 生态的基础设施，它为真正的去中心化应用提供一种通用的社区治理机制。</p>`
  },
  '3': {
    title: '3. 动因',
    body: `
      <h3>3.1. 公链的一些独有特征</h3>
      <p>在区块链不长的发展历史中有过多次重大的社区内部分岐，尽管社区各方付出了巨大的努力协调解决此类争端，但大多最终未能达成有效的解决方案，有些还导致区块链的硬分叉。其中以 BTC 和 BCH 之间的硬分叉最为著名，这也导致了社区的分裂。在反思这些事件时，重要的是要认识到区块链项目区别于传统互联网产品的独有特征：</p>
      <ol>
        <li><span>1)</span>社区是公链发展最主要的推动力。这是由于公链不同于传统软件产品，由社区共同运营，不应该受任何团队或阵营控制。</li>
        <li><span>2)</span>社区达成共识不是一件容易的事。社区每个成员或者团队都可能有不同的价值观和利益诉求。</li>
        <li><span>3)</span>公链的技术推进相对缓慢。从 BTC 出现扩容争议到最终以硬分叉结束，前后耗时两年多，并且结果并不理想。而在传统互联网中，类似的产品升级只需要几周时间。</li>
      </ol>
      <p>此外，区块链行业还存在一个不容辩驳的事实：虽然已经经过了10年时间的发展，但社区和应用生态依然不够繁荣，与传统互联网有着巨大的差距。</p>

      <h3>3.2. 社区决策机制</h3>
      <p>一些著名的公链都有推进各自技术发展的机制，比如 BTC 的 BIP（Bitcion Improvement Proposal）和 ETH 的 EIP（Ethereum Improvement Proposal）。在这些机制中，是否采纳社区技术改进提案的决定权基本都在区块链核心开发团队手中。这些核心开发团队的形成各有其历史原因，但无可否认的是，他们在其公链的技术发展上有非常大的话语权，普通开发者很难加入到这个群体中，这与区块链去中心化的价值观并不相符。</p>
      <p>公链的代码即共识，在一个完全去中心化的公链社区中应该没有任何团队可以通过修改代码去控制它。亦来云区块链作为一条公链，在 BPoS 共识上线后已经完全向社区开放，即便是创始团队亦来云基金会也不能任意修改并升级区块链的代码。随着项目去中心化程度的提高，区块链技术的进化也将会变得越来越困难。</p>
      <p>技术升级只是区块链社区治理需要解决问题中的一个方面。以此展开，还有许多其他的社区事务需要全社区参与决策，比如改变经济模型或者利益分配方式，这些是纯粹的链上共识不能解决的问题。</p>
      <p>因此，我们有必要利用区块链技术形成真正的社区共识，而不是依赖其中的部分团队或阵营代表所有人做出决定。</p>

      <h3>3.3. 生态发展和社区贡献</h3>
      <p>去中心化是区块链最重要的价值观和技术特性，同时意味着权力的去中心化(比如创始团队对产品的控制权和运营权)。相应的，权力的去中心化必将导致责任的去中心化。</p>
      <p>可以设想在一个完全去中心化的社区中，谁将负责拓展社区和发展应用生态?完全依靠社区成员的自发性必然因缺乏足够的向心力和动力致使发展的过程非常缓慢，无法形成应有的合力，这是整个区块链行业都面临的问题。</p>
      <p>因此，我们需要在形成社区共识的基础上，激励为 DAO 社区和亦来云生态做出贡献的个人和团队，吸引更多的人加入社区成为贡献者，加速推进社区和应用生态的发展。</p>
      <p>为了解决上述社区决策以及贡献者激励的问题，我们结合亦来云区块链技术，提出了亦来云的第三种共识 —— PoI。</p>`
  },
  '4': {
    title: '4. 基础原理',
    body: `
      <p>与以安全可信地记录区块链账本为目标的 BPoS 和 PoW 不同，PoI 以社区事务为共识目标，因此执行主体由机器变成了每一个社区的持币人。简单的说，PoI 是一种以持币人为节点的共识机制，以让所有社区成员都可以公平地参与社区贡献和决策。</p>
      <p>BPoS 和 PoW 等纯链上共识需要共识的目标非常明确，就是需要上链的交易和区块。但 PoI 的共识目标是不清晰的，因为所谓的社区事务并不是一个确定的概念，这就需要能够提出确定议题的人。</p>
      <p>由于社区所涉及的范围是变化且规模难以确定的，不可能允许每一个社区成员都有提出议题让全社区共识的权利。我们需要缩小范围，引入代理人机制，即首先由全社区投票产生出确定数量的代理人，由代理人推荐社区议题(以下称为提案)并投票决策。代理人及其推荐提案的相关行为都会通过区块链的 PoI共识规则接受全社区监督。</p>
      <p>这个过程类似于 BPoS，只是执行主体由机器变成了社区成员，选出的代理人则类似于 BPoS 中的超级节点。PoI 代理人和 BPoS 超级节点功能上最大的不同是，PoI 代理人多出了推荐社区提案的权利。</p>
      <p>在具体实现上，为了把区块链公开、透明、不可更改的特性引入到 PoI 中，从 PoI 代理人选举开始，到提案的发起、投票表决和执行跟踪，所有参与共识的个体行为都通过区块链的交易进行，这意味着他们需要使用数字签名确认其身份。这些交易受 PoI 相关的区块链代码规则控制，社区成员可以很方便的从支持 PoI 的客户端(以下“客户端”一词均指支持 PoI 的区块链客户端)参与并监督共识进展。</p>`
  },
  '5': {
    title: '5. 两个重要角色',
    body: `
      <p>为了方便以后的阐述，我们需要给 DAO 社区中两个重要角色明确的定义。</p>

      <h3>5.1. Elastos 委员</h3>
      <p>由社区通过区块链投票选举出来的代理人。他们是 PoI 共识中所有社区成员中的“超级节点”，代为决策社区事务。Elastos 委员的权利和义务如下：</p>
      <ol>
        <li><span>1)</span>普通社区成员共有的权利和义务；</li>
        <li><span>2)</span>提案推荐权。将社区的建议性提案(参见7.1.)推荐为 PoI 正式提案，进入共识流程；</li>
        <li><span>3)</span>提案表决权。对提案进行投票表决，赞同、反对或者弃权。</li>
      </ol>

      <h3>5.2. 社区成员</h3>
      <p>DAO 社区中的每一个持币人。他们共有的权利和义务如下：</p>
      <ol>
        <li><span>1)</span>选举权。通过投票的的形式支持某些候选人成为 Elastos 委员；</li>
        <li><span>2)</span>被选举权。参选 Elastos 委员的权利；</li>
        <li><span>3)</span>提案建议权。向 Elastos 委员提出建议性提案，Elastos 委员如果采纳可将建议性提案推荐为 PoI 正式提案；</li>
        <li><span>4)</span>监督和弹劾 Elastos 委员的权利。每一个社区成员均能对 Elastos 委员的行为进行监督，对自己认为不合格的 Elastos 委员以投票形式进行弹劾；</li>
        <li><span>5)</span>对提案过程的监督和反对的权利。社区成员可以通过客户端对提案的投票和执行过程进行全程监督。Elastos 委员们投票表决通过的提案有一个公示期，在公示期内对不满意的提案可以通过投票形式进行反对。</li>
      </ol>
      <p>是否还需要现实社会治理体系中的其它角色，比如仲裁院或法院，或者监督委员会？在 PoI 中可以通过提案对社区事务争议进行仲裁，这本身就涵盖了法院的类似职能。而投票和提案过程都在区块链上流转，所有社区成员都能通过客户端监督这一过程的执行，并通过反对提案或者弹劾委员的方式进行干涉。</p>
      <p>区块链公开、透明和不可更改的特性让信息的传递没有障碍，从而使得社区形成共识的过程变得简单而无需太多角色。</p>`
  },
  '6': {
    title: '6. Elastos 委员会',
    body: `
      <h3>6.1. Elastos 委员会</h3>
      <p> Elastos 委员由社区成员通过区块链投票形式选举产生，目前定为12人。这12人共同组成了 Elastos 委员会，他们共同对 DAO 社区负责。随着社区的扩大，委员人数有可能由社区通过 PoI 共识进行变动。</p>
      <p>不同于一般概念上的董事会、理事会这样的组织形式，Elastos 委员会是一个松散的联合体。理论上 Elastos 委员之间不必相互认识和沟通，不需要有共同的目标，更不用协同工作，其一切共识行为都围绕着提案和投票展开。所以我们不用过于在意 Elastos 委员会这个概念，实际上它并不是一个通常意义上的组织，委员之间就象 BPoS 超级节点之间的关系一样。</p>
      <p> Elastos 委员会由一个区块链代码中固定不变的 ELA 地址代表，当届 Elastos 委员会可动用的 ELA 被存放于该地址中(参见9.3.)。</p>

      <h3>6.2. 选举规则</h3>
      <p>所有准备参与 Elastos 委员竞选的社区成员都必须拥有亦来云 DID，他们可以通过客户端发起参选交易，用以向社区宣告参与 Elastos 委员的选举，同时质押5000 ELA 以证明参选资格。如未当选，这些 ELA 将被自动解除质押。</p>
      <p> Elastos 委员由社区成员在客户端中使用 ELA 投票产生，所有的投票信息都将通过区块链实时记录并反应到客户端中。投票截止时得票数排前12位的参选人将当选为 Elastos 委员。</p>

      <h3>6.3. 弹劾委员</h3>
      <p>在 Elastos 委员履职期间，社区成员可以在任意时间以投票形式对不满意的 Elastos 委员进行弹劾，当累计弹劾票数超过 ELA 总流通量(除 DAO 资产地址以外的 ELA 均被视为可流通 ELA，参见9.3.)对应总票数的20%时，被弹劾委员将自动去职。</p>

      <h3>6.4. 回报</h3>
      <p> Elastos 委员既是一种荣耀和权利，同时也肩负着亦来云社区治理以及发展亦来云生态的责任。为了激励 Elastos 委员更好的履行其职能，在亦来云 BPoS 共识中，为每一位 Elastos 委员保留了运行一个 BPoS 超级节点的权利，同时也是其责任和义务。这个超级节点是天然的当选节点，不通过 BPoS 投票产生，因此不享有投票收益。</p>

      <h3>6.5. 任职周期</h3>
      <p>正常情况下 Elastos 委员任职周期为一年（262,800个主链出块周期），任职期满前一个月（21,900个主链出块周期）自动开启新一届的 Elastos 委员换届选举。</p>
      <p>如果 Elastos 委员被弹劾成功，该委员将自动去职，不再具备委员资格。</p>
      <p>此外，如果 Elastos 委员的 BPoS 超级节点被置于 Inactive 状态，其委员资格也将被暂停直到其 BPoS 超级节点恢复 Active 状态；如果 Elastos 委员的 BPoS 超级节点因作恶被置为 Illegal 状态，该委员也将自动去职。</p>
      <p> Elastos 委员会成员数量少于满员的2/3时自动开启新一轮的 Elastos 委员会换届选举。</p>

      <h3>6.6. 票权</h3>
      <p>在 PoI 中持币人持有的 ELA 数量即持币人的票权数量，不取整。</p>
      <p>选举期间，持币人的票权可以根据他自己的意愿任意分配给一个或多个候选人。票权也可以用于弹劾委员或对公示期的提案投反对票(参见7.3.)，不同投票场景下票权独立计算，可重叠使用。</p>
      <p>例如，某次换届选举时某持币人持有18.5个 ELA，即他拥有18.5个票权。选举时他可以把其中的10个投给候选人 A，另外8.5个投给侯选人B。与此同时，他还能把这18.5个票权用于弹劾某个现届委员，但在弹劾委员时，票权不能重复使用，即同一票权不能既用于弹劾委员 A，又同时用于弹劾委员 B。而所有这些行为都不会影响持币人在 BPoS 选举中的投票。</p>
      <p>需要注意的是，持币人做 ELA 交易会造成票权的变动，如果某次交易造成持币人剩余票权不足以满足他在某个投票场景中投出的票权，会导致该持币人在该场景中的投票被取消。</p>

      <h3>6.7. 质押及返还</h3>
      <p> Elastos 委员在履职期间需要质押5000 ELA。这5000 ELA 同时也被用于委员的 BPoS 超级节点的质</p>
      <p>押，因节点不良行为的质押扣除规则与普通 BPoS 超级节点一样。</p>
      <p>Elastos 委员履职结束后(包括换届和被弹劾离职)，质押的 ELA 将根据未履职时间和未投票表决的提案比例进行扣除，剩余的 ELA 返还到委员的钱包中。如果 Elastos 委员是因被取消超级节点资格而离职，将被扣除全部质押金。</p>
      <p>如：假定某委员正常工作至换届，履职期间共有 ​M ​个提案，其中该委员表决过的提案数为 ​N，​剩余质押金为 ​P​（有可能因为其 BPoS 超级节点被惩罚而使得 ​P ​小于5000 ELA），那么应返还的质押金 R 为​：</p>
      <p>R = P * (N / M)</p>
      <p>如果该委员因被弹劾提前离职，假定其实际履职的区块周期为 ​T，​ 那么应返还的质押金 R 为：</p>
      <p>R = P * (T / 262800) * (N / M)</p>
      <p>被扣除的质押金将永远不会再流通，等同于销毁。</p>`
  },
  '7': {
    title: '7. 提案',
    body: `
      <p>提案即需要经过 PoI 共识的议题。一个提案通常需要具备以下几个要素：</p>
      <ul>
        <li>与 DAO 和亦来云技术发展相关的主题；</li>
        <li>要解决的问题以及希望达成的目标；</li>
        <li>计划达到目标的具体方法和过程；</li>
        <li>提案的执行人或者团队；</li>
        <li>预期提案的执行周期和阶段检查点；</li>
        <li>相关经费预算及支出计划(如涉及)。</li>
      </ul>
      <p>社区的建议性提案被 Elastos 委员推荐之后，所有相关的共识行为都将以交易形式记录于区块链上向社区公示。</p>

      <h3>7.1. 提案建议权</h3>
      <p>所有使用并公开了亦来云 DID 的社区成员均可以向 Elastos 委员提出建议性提案，建议性提案需要由提案人使用私钥签名且内容不可更改。对建议性提案， Elastos 委员可以向 Elastos 委员会推荐，也有权拒绝。</p>

      <h3>7.2. 提案推荐权</h3>
      <p> Elastos 委员通过在建议性提案上附加自己的私钥签名的方式推荐提案。在 Elastos 委员即是提案人的情况下，两次签名可能是同一个人。Elastos 委员签名后的建议性提案成为 PoI 合法提案，可被发布于区块链上由 Elastos 委员会投票表决，开启提案的共识流程。</p>
      <p>单个 Elastos 委员在任期内推荐的提案数量不能超过128个。在 Elastos Council 换届选举期间，现任 Elastos 委员不能再推荐新的提案，但依然可以对未完成投票的提案投票表决。</p>

      <h3>7.3. 投票和公示</h3>
      <p>提案进入投票表决环节后，由 Elastos 委员在七个自然日（5,040个主链出块周期）内以钱包签名的形式一人一票地对提案交易进行投票表决。在投票表决期结束时提案获得不少于满员的2/3的赞同票，该提案即通过了 Elastos 委员会的投票表决。投票表决未通过的提案为无效提案。</p>
      <p>提案通过 Elastos 委员会投票表决后，立即开始七个自然日（5,040个主链出块周期）的公示期。在公示期内所有社区成员都可以通过客户端对不赞同的提案投反对票，当累计反对票数超过总流通量对应票数的10%后，该提案变为无效。同一票权可同时对多个不同的提案投反对票。</p>
      <p>通过投票和公示后，提案进入执行阶段。</p>

      <h3>7.4. 提案类别</h3>
      <p>某些提案需要共识代码执行一些特别的规则，因此有必要对提案进行分类以便于代码识别，这些提案的类别包括但不限于：</p>
      <ul>
        <li>代码升级</li>
        <li>添加侧链</li>
        <li>更换提案负责人(参见7.7.)</li>
        <li>终止提案(参见7.9.)</li>
        <li>提名 Elastos 委员会秘书长(参见8.1.)</li>
      </ul>
      <p>除了和基础设施共识相关的特殊提案类别外，某些重量级的 DApp 还可以向 Elastos Council 申请用于 DApp 共识治理的提案类别，比如 DEX (去中心交易所)的开发者可以向 Elastos Council 申请用于上币决策的 提案类别。</p>
      <p> PoI 的提案类别将通过一个信息类的 ELIP (Elastos Improvement Proposal）维护和公示。</p>

      <h3>7.5. Elastos 委员会秘书处</h3>
      <p>一些简单的提案可能易于决策且执行周期很短，但更多的提案却没有这么简单，涉及的复杂程度可能包括：</p>
      <ul>
        <li>提案的执行周期长，需要跟踪、监督和调整；</li>
        <li>需要专业的知识以判断提案内容的合理性；</li>
        <li>执行中的遇到的问题过于琐碎，需要变更的次数过多。</li>
      </ul>
      <p>理论上可以通过频繁提交提案调整和积累经验以解决上述问题，但现实中会受到时间、资金以及沟通成本的限制，提案流程和执行跟踪的复杂程度也会影响 Elastos 委员的工作效率。</p>
      <p>因此，Elastos 委员会显然需要一个常设的执行机构以辅助决策、跟踪执行以及处理一些日常性的事务，可称之为 Elastos 委员会秘书处，Elastos 委员会秘书处的负责人为 Elastos 委员会秘书长。</p>

      <h3>7.6. 提案负责人及执行跟踪</h3>
      <p>最初建议性提案的提出者是默认的提案负责人。提案经 PoI 共识通过后，提案负责人有责任跟踪和反馈提案的执行情况，就执行状态和 Elastos 委员会秘书处达成共识。双方达成共识的方式为：提案负责人向秘书处提交提案执行跟踪信息，秘书处对该信息进行审查核实。</p>
      <p>共识通过的提案执行跟踪信息会以提案负责人和 Elastos 委员会秘书长联合签名的交易发布到主链上，以作为提案的附属信息进行公示。单个提案的执行跟踪信息不能超过128条。</p>

      <h3>7.7. 更换提案负责人</h3>
      <p>某些情况下，提案负责人不能再履行提案跟踪的职责，可以通过以下两种方式之一为提案更换提案负责人：</p>
      <ol>
        <li><span>1)</span>原提案负责人向 Elastos 委员会秘书处发出更换提案负责人的提议，该提议包含原提案负责人和候选提案负责人的签名，秘书处审核通过并签名即三方达成共识，该提议会以三方联合签名的交易公示于区块链上。这是一种轻量级的变更方式，前提是原提案负责人还能履行基本职责并且愿意主动更换提案负责人；</li>
        <li><span>2)</span>候选提案负责人提出更换提案负责人的提案并经 PoI 共识通过。这种方式相对比较重量级，适用于原提案负责人已经无法或者不愿履行任何职责的情况。在提出提案之前，Elastos 委员或者秘书处需要与提案的执行团队进行线下协商，确定新的候选提案负责人。</li>
      </ol>

      <h3>7.8. 预算及支出</h3>
      <p>如果提案的执行需要 ELA 的支出，在提案中则必须提交预算和支出计划，并指定一个接收 ELA 的地址。</p>
      <p>支出计划通常需要与提案执行计划中的阶段检查点对应，并设定一个或多个阶段支出目标，其中第一个支出目标将随提案一起被批准支出。其余的支出目标则必须说明支付条件，在提案的执行过程中将以执行跟踪信息作为这些支出目标被批准的依据。这意味着剩余这些目标的实际批准仅需要在提案负责人和秘书处之间达成共识，因此包含多阶段支付目标的单个提案通常仅适用 于一些小额周期性支出的提案。</p>
      <p>当 Elastos 委员认为分阶段执行的项目很重要或者预算需要支出的 ELA 数量比较多时，应该要求项目的提案负责人在每个执行阶段都独立提交该阶段的提案，以让更多的人参与提案执行状态及支付的共识。</p>
      <p>对于提案中已经被批准支出的额度，提案负责人可以在当届 Elastos 委员会的任期内，从 Elastos 委员会经费地址中提取这个数量的 ELA 到提案中指定的接收地址。</p>

      <h3>7.9. 提案的结束和终止</h3>
      <p>提案执行完成后，提案负责人向 Elastos 委员会秘书处发出结束提案的提议，秘书处经审查核实同意结束提案即双方达成共识。结束提案的提议将以双方联合签名的交易发布在区块链上，做为提案的附属信息向社区公示。</p>
      <p>在一个提案的执行过程中，也可能出现无法或不应继续执行的情况，此时应该使用“终止提案”类别的提案终止该提案。</p>
      <p>批准“终止提案”的共识过程与普通提案一致，提案通过后区块链相关代码将自动执行提案，因此提案通过即进入结束状态，不再需要后续执行跟踪信息。</p>

      <h3>7.10. 状态和流程</h3>
      <p>以提案人向 Elastos 委员提出建议性提案为起始，提案相关的共识状态及流程如下；</p>
      <img src=\"/assets/images/whitepaper.png\" width=\"100%\" alt=\"\">
      <ul>
        <li><strong>Submitted：</strong>提案作者完成提案内容并签名后的提案状态。此状态的提案还不能被发布到区块链上，这意味着通过去中心化的客户端不能看到社区中的此类提案。</li>
        <li><strong>Council Voting：</strong>获得 Elastos 委员推荐并处于投票表决期的提案状态。提案上附有两个签名：提案作者和推荐者的签名，这是发布于区块链上的合法 PoI 提案。</li>
        <li><strong>Community Review：</strong>Elastos 委员会表决通过并处于公示期的提案状态。</li>
        <li><strong>Tracked：</strong>通过公示期的提案进入执行期，需要对提案进行执行跟踪。一些区块链代码自动完成执行的提案则没有此状态。</li>
        <li><strong>Finalized：</strong>提案的完结状态。该状态的提案通常意味着提案达到了预期的目标。</li>
        <li><strong>Rejected：</strong>​在投票表决期或者公示期被拒绝的提案状态。</li>
        <li><strong>Canceled：</strong>虽然被 Elastos Council 批准执行，但被提前终止的提案状态。</li>
      </ul>
      <p>提案可视为提案负责人和 DAO 社区之间达成的一份公开合约，提案生效后即形成社区共识，全 DAO 社区都应共同遵守提案的内容约定。</p>`
  },
  '8': {
    title: '8. Elastos 委员会秘书处',
    body: `
      <h3>8.1. 产生办法</h3>
      <p>Elastos 委员会以提案的形式提名并选举出新的 Elastos 委员会秘书处的负责人，即 Elastos 委员会秘书长，再由 Elastos 委员会秘书长提出秘书处组建方案的提案，以组建新的 Elastos 委员会秘书处。</p>
      <p>Elastos 委员会秘书长必须使用并公开其亦来云 DID，Elastos 委员会秘书处必须使用单地址钱包并公开秘书处 ELA 地址。</p>

      <h3>8.2. 权利和职责</h3>
      <p>Elastos 委员会秘书处对 Elastos 委员会负责，其职责由 Elastos 委员会在选举新的 Elastos 委员会秘书长时通过提案定义。一般情况下，其责职可能包括但不限于：</p>
      <ul>
        <li>Elastos 委员会换届选举后，向新的 Elastos 委员会提交当届秘书处工作计划及预算；</li>
        <li>Elastos Council 换届选举开始前，向 Elastos 委员会提交秘书处工作总结及决算。如果未能及时提交，则应在换届后向新的 Elastos 委员会提交；</li>
        <li>维持 PoI 的运转，比如 DAO 网站的维护和改进；</li>
        <li>根据委员要求召集临时性的会议；</li>
        <li>根据委员要求聘请领域专家给提案做出评审报告以辅助决策；</li>
        <li>审核提案的跟踪和执行情况，必要时提出修正提案；</li>
        <li>帮助有需要的委员运维超级节点(应收取必要的运维费用)；</li>
        <li>维护和 PoI 共识改进相关的信息类 ELIP（Elastos Improvement Proposal）。</li>
      </ul>
      <p>Elastos 委员会秘书处作为 Elastos 委员会的附属工作机构，其主要目的是保证 PoI 的正常运转，发展社区和生态不应该成为它职责的一部分。</p>

      <h3>8.3. 履职周期</h3>
      <p>为了维护提案执行的连续性，Elastos 委员会秘书处并不随 Elastos 委员会的换届而更换。当 Elastos 委员认为有更好的 Elastos 委员会秘书长人选时，应该用提案的形式提名新的 Elastos 委员会秘书长。</p>`
  },
  '9': {
    title: '9. DAO 社区资产',
    body: `
      <h3>9.1. 必要性</h3>
      <p>一些区块链项目在初期迅猛发展后就失去了前进的动力，因为创始团队完成了创始职责，代币的分配也基本重构完成，没有持续的经济激励的社区失去了项目发展和扩张的源动力。</p>
      <p>所以，维持一定规模及可持续的社区资产是必要的，社区共识的执行很多时候都需要社区资 产的支持，无论是 Elastos 委员会的运作、技术改进、生态发展还是社区活动，都有可能需要经济方面的激励。</p>

      <h3>9.2. 资产来源</h3>
      <p>DAO 社区资产主要来源于三个方面：</p>
      <ol>
        <li><span>1)</span>来自社区团队或个人的捐赠；</li>
        <li><span>2)</span>亦来云代币每年1.2%的增发；</li>
        <li><span>3)</span>投资回报，包括对生态应用类项目和基金类项目的投资。</li>
      </ol>
      <p>出于上链管理需要和安全性的考虑，DAO 社区资产只接受和管理 ELA，其它形式的数字资产应该用回购的形式转换成 ELA。</p>
      <p>这些资产在接收后会被存放于一个对全社区公开的地址上（称为 DAO 资产地址），该地址是一个特殊的 ELA 地址，其使用规则被写入区块链代码中。</p>

      <h3>9.3. 使用规则</h3>
      <p>DAO 社区资产由两个特殊的 ELA 地址控制，这两个地址分别代表 DAO 资产和 Elastos 委员会经费，地址均对全社区公开，并受区块链代码控制。</p>
      <p>DAO 资产地址中存放的是全 DAO 社区共有的总资产，其使用规则固定在区块链代码中。每次 Elastos Council 换届选举完成后，新一届 Elastos 委员会在任期内可以从 DAO 资产地址划拔总资产10%的 ELA 到 Elastos 委员会经费地址中。</p>
      <p>Elastos 委员会经费地址存放支撑当届 Elastos 委员会运转的 ELA，该地址上 ELA 的使用由 PoI 提案相关的代码控制，且只能用提案的形式批准支付流通，Elastos 委员会无法单独构建交易转出资产。单个提案所能动用的费用上限被限定为当届 Elastos 委员会经费总额的10%。</p>`
  },
  '10': {
    title: '10. 未来展望',
    body: `
      <p>PoI 不仅是一种区块链社区治理的共识机制，它还是亦来云生态最重要的基础设施之一，它
      和 PoW 及 BPoS 一起为真正的去中心化应用及服务打下坚实的基础。</p>
      <p>通过对提案类别的扩展，PoI 的应用范围不只限于区块链领域，还可以广泛适用于基于亦来云技术的侧链、跨链、去中心化交易所、去中心化游戏、数字资产管理、去中心化电商等各个应用领域。</p>
      <p>更进一步，在提案的类别之上，还可以演化出智能合约型提案。不同于传统可任意部署的开 放型智能合约，PoI 的智能合约提案经过提案人和 Elastos 委员会的共同签名，并由全社区参与见证，其实用性和安全性都会有极大的保障。</p>`
  },
  A: {
    title: '附录 A 正文未详述的内容',
    body: `
      <h3>A.1. 对 PoI 各角色的约束条件</h3>
      <p>白皮书中对 Elastos 委员、Elastos 委员会秘书长、提案负责人等角色的公开信息和行为仅提出了执行共识规则所必须的最基础的约束条件。在实际操作中，可以根据不同共识场景的需要对目标对象提出更多的要求。</p>
      <h3>A.2. 提案内容的格式化</h3>
      <p>提案相关的一些共识规则的执行建立在区块链代码自动识别提案内容的基础上，因此有必要对提案及其附属的执行跟踪信息进行格式化设计。这些设计应该通过 ELIP 进行定义和改进。</p>
      <h3>A.3. PoI 的代码设计和实现</h3>
      <p>PoI 由亦来云区块链主链代码完成实现支持，与 PoI 实现相关的具体技术原理和规范应通过 ELIP 进行描述和改进。</p>
      <h3>A.4. 支持 PoI 的客户端</h3>
      <p>支持 PoI 的客户端需要遵从亦来云区块链关于 PoI 的接口设计规范，这些规范由相关 ELIP  进行定义。在此基础上，客户端可以根据需要进行优化以提升用户体验，比如通过建立区块链全节点和缓存服务获得更快的响应速度。</p>
      <h3>A.5. Elastos 委员会下属机构</h3>
      <p>白皮书中仅定义了和 PoI 共识相关的一个 Elastos 委员会下属执行机构：Elastos 委员会秘书处，但这并不意味着 Elastos 委员会不能建立其它下属机构。比如可以以提案方式设立技术标准委员会，以帮助创建和审核亦来云相关技术标准。</p>`
  },
  B: {
    title: '附录 B PoI 的改进',
    body: `
      <h3>B.1. 白皮书</h3>
      <p>PoI 白皮书目前由 Elastos 委员会和秘书处一起维护。您可以通过电子邮件联系该工作组：secretariat@cyberrepubli.org，任何与白皮书相关的建议都应转发至此电子邮件地址。</p>
      <h3>B.2. 相关 ELIP</h3>
      <p>ELIP（Elastos Improvement Proposal）是面向开发者社区的一种 PoI 提案类别，其目的是推动亦来云技术基础设施的改进。目前用于定义 ELIP 的提案 ELIP-1（ELIP Purpose and Guidlines）尚处于草案阶段。</p>
      <p>PoI 相关的 ELIP 编号和标题应被收录于此附录中以便于读者查找。</p>`
  }
}
