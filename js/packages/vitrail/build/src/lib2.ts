
/**
 * Core concepts
 */

type Filter<U,V> = (arg: U) => V;
type Task<T> = [Filter<T,T>, ...string[]];
type Branch<U,V> = Filter<U,V>; //() => [Filter<U,V>, ...Task<V>[]]
type Adapter<T, U, TConvert> = <K extends TConvert>(...args: (Task<T> | K)[]) => Branch<U,T>;
type Curator<T> = (retriever: Filter<void,T>) => void; 
type Sync<T> = [Curator<T>, Filter<void,T>];
type Query = Sync<[string, unknown][]>;


/**
 * DOM Manipulation
 */

type NodeFactory<T, U> = (doc: U, tag: string) => [T,U];
type NodeBranch<T,U> = Branch<U, [T,U]>;
type NodeTask<T,U> = Task<[T,U]>;
type NodeConnector<TNode,TChild,U> = <T extends TNode, V extends TChild>(branch: NodeBranch<V,U>) => NodeTask<T,U>;
type NodeAdapterArg<T,TChild,TConvert,U> = (NodeTask<T,U> | TConvert | NodeBranch<TChild,U>)[];
type NodeAdapterArgsFormater<TNode,TChild,TConvert,U> = <T extends TNode>(connector: NodeConnector<T,TChild,U>) => (args: NodeAdapterArg<T,TChild,TConvert,U>) => NodeTask<T,U>[];
type NodeAdapter<T,TChild,TConvert,U> = Adapter<[T,U], U, TConvert | NodeBranch<TChild,U>>; 

const createDOMAdapter = <TDoc extends Document, TNode extends Node, TChild extends Node, TConvert>(
    tagName: string,
    factory: NodeFactory<TNode,TDoc>, 
    connector: NodeConnector<TNode,TChild,TDoc>,
    format: NodeAdapterArgsFormater<TNode,TChild,TConvert,TDoc>
): NodeAdapter<TNode,TChild,TConvert,TDoc> => 
    (...args: NodeAdapterArg<TNode,TChild,TConvert,TDoc>): NodeBranch<TNode,TDoc> => {
        const tasks = format(connector)(args).map(entry => entry[0]);
        return (doc: TDoc) => tasks.reduce((node, task) => task(node), factory(doc, tagName));
    }
    

const textFactory: NodeFactory<Text, Document> = (doc: Document, _: string) => 
    [doc.createTextNode(''), doc];

const htmlElementFactory: NodeFactory<HTMLElement, Document> = (doc: Document, tagName: string) => 
    [doc.createElement(tagName), doc];

const svgElementFactory: NodeFactory<SVGElement, XMLDocument> = (doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/2000/svg", tagName), doc];

const mathElementFactory: NodeFactory<MathMLElement, XMLDocument> = (doc: XMLDocument, tagName: string) => 
    [doc.createElementNS("http://www.w3.org/1998/Math/MathML", tagName), doc];

const appendNode: NodeConnector<Node, Node, Document> = 
    <U extends Node, V extends Node>(branch: NodeBranch<V, Document>): NodeTask<U, Document> => [
        (entry: [U,Document]) => {
            entry[0].appendChild(branch(entry[1])[0]);
            return entry;
        }
    ];

const formatAdapterArgs: NodeAdapterArgsFormater<Node,Node,string,Document> = 
<T extends Node>(connector: NodeConnector<T,Node,Document>) => (args: NodeAdapterArg<T,Node,string,Document>): NodeTask<T,Document>[] => 
    args.map(arg => {
        if(typeof arg === 'function') return connector(arg);
        if(typeof arg === 'string') return [
            (entry: [T,Document]) => {
                entry[0].appendChild(entry[1].createTextNode(arg));
                return entry;
            }
        ];
        return arg;
    });

