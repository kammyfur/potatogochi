/*
     ____   ___ _____  _  _____ ___   ____  ___   ____ _   _ ___
    |  _ \ / _ \_   _|/ \|_   _/ _ \ / ___|/ _ \ / ___| | | |_ _|
    | |_) | | | || | / _ \ | || | | | |  _| | | | |   | |_| || |
    |  __/| |_| || |/ ___ \| || |_| | |_| | |_| | |___|  _  || |
    |_|    \___/ |_/_/   \_\_| \___/ \____|\___/ \____|_| |_|___|

                        == Un projet de NSI ==

    Date de début :        18 novembre 2022
    Date de fin :          20 novembre 2022
    Durée de réalisation : 2 jours
    Navigateur de test :   Firefox 108.0b3

    LICENCE
    =======

    © 2022 Equestria.dev, Tous droits réservés.

    Ce contenu est fourni à des fins éducatives uniquement. Il
    ne peut être reproduit, publié ou modifié sans l'autorisa-
    tion des auteurs originaux.

    STATISTIQUES
    ============

                    ╔══════════════════════╗
                    ║  852 LIGNES DE CODE  ║
                    ╚══════════════════════╝

                               ┌──────┬──────┬──────┬───────────┐
                               │ HTML │  CSS │  TS  │   TOTAL   │
    ┌──────────────────────────┼──────┼──────┼──────┼───────────┤
    │ Lignes de code uniques   │  25  │  57  │ 199  │    281    │
    ├──────────────────────────┼──────┼──────┼──────┼───────────┤
    │ Lignes de commentaire    │  15  │  43  │ 360  │    418    │
    ├──────────────────────────┼──────┼──────┼──────┼───────────┤
    │ Lignes vides             │  20  │  51  │  82  │    153    │
    ├──────────────────────────┼──────┼──────┼──────┼───────────┤
    │ Total des lignes         │  60  │ 151  │ 641  │    852    │
    └──────────────────────────┴──────┴──────┴──────┴───────────┘

    Nombre de types :      8
    Nombre de méthodes :   12
    Nombre de propriétés : 9
    Nombre de bro hoof :   101

                               · ^c^ ·
*/

/**
 * Un couple de valeurs représentant des coordonnées
 * dans un repère en 2 dimensions. /)
 *
 * @property x - La position en abscisse
 * @property y - La position en ordonnée
 */
interface Coordinates {
    x: number;
    y: number;
}

/**
 * Comme Coordinates, mais explicitement pour une boîte
 * de collisions. /)
 *
 * @extends Coordinates
 */
interface ColliderCoordinates extends Coordinates {}

/**
 * La direction verticale d'une instance Direction.
 * - None : pas de movement vertical
 * - Top : mouvement vers le haut
 * - Bottom : mouvement vers le bas
 * /)
 *
 * @enum {number}
 * @requires Direction
 */
enum VDirection {
    None,
    Top,
    Bottom
}

/**
 * La direction horizontale d'une instance Direction.
 * - None : pas de movement horizontal
 * - Left : mouvement vers la gauche
 * - Right : mouvement vers la droite
 * /)
 *
 * @enum {number}
 * @requires Direction
 */
enum HDirection {
    None,
    Left,
    Right
}

/**
 * Un ensemble de directions à prendre, verticale
 * et horizontale. /)
 *
 * @property vertical - La direction verticale
 * @property horizontal - La direction horizontale
 */
interface Direction {
    vertical: VDirection,
    horizontal: HDirection
}

/**
 * Un movement unique que l'objet doit effectuer. /)
 *
 * @property direction - Une Direction que l'objet doit prendre
 * @property amount - Le nombre de pixels dont l'objet doit se
 * déplacer dans toutes les directions
 */
interface Movement {
    direction: Direction,
    amount: number
}

/**
 * Le fichier de visage à afficher /)
 *
 * @enum {number}
 */
enum Face {
    MouthHappyEyesClosed,
    MouthHappyEyesOpen,
    MouthOpenEyesClosed,
    MouthOpenEyesOpen,
    MouthSadEyesClosed,
    MouthSadEyesOpen
}

/**
 * Une instance du jeu Potatogochi /)
 */
class PotatogochiInstance {
    /**
     * L'élément DOM de la pomme de terre /)
     * @private
     */
    private readonly potatoElement: HTMLImageElement;

    /**
     * L'élément DOM du visage de la pomme de terre /)
     * @private
     */
    private readonly potatoFaceElement: HTMLImageElement;

    /**
     * L'élément DOM de la boite de collision du jeu /)
     * @private
     */
    private readonly potatoColliderElement: HTMLDivElement;

    /**
     * La largeur de l'écran (moins la moitié de la pomme de terre) /)
     * @private
     */
    private readonly width: number = window.innerWidth - 128;

    /**
     * La longueur de l'écran (moins la moitié de la pomme de terre) /)
     * @private
     */
    private readonly height: number = window.innerHeight - 128;

    /**
     * Si la souris est présente ou non dans la fenêtre /)
     * @private
     */
    private mouse: boolean = true;

    /**
     * Les coordonnées de la boîte de collision par rapport à
     * la fenêtre, utilisées pour calculer l'angle /)
     * @private
     */
    private angleCoordinates: ColliderCoordinates;

    /**
     * Les coordonnées de la boîte de collision /)
     * @private
     */
    private colliderCoordinates: ColliderCoordinates;

    /**
     * La direction du mouvement actuel /)
     * @private
     */
    private movementDirection: Direction = {
        horizontal: HDirection.None,
        vertical: VDirection.None
    }

    /**
     * Construit une nouvelle instance de Potatogochi à partir
     * des éléments DOM passés en paramètre. /)
     *
     * @constructor
     * @param element - L'élément DOM de la pomme de terre
     * @param faceElement - L'élément DOM du visage de la pomme de terre
     * @param colliderElement - L'élément DOM de la boîte de collision du jeu
     */
    constructor(element: HTMLImageElement, faceElement: HTMLImageElement, colliderElement: HTMLDivElement) {
        // On associe les 3 éléments passés en paramètres aux propriétés
        // correspondantes. /)
        this.potatoElement = element;
        this.potatoFaceElement = faceElement;
        this.potatoColliderElement = colliderElement;

        // Définit colliderCoordinates sur les coordinates actuelles
        // de la boîte de collision (coordonnées de départ). /)
        this.colliderCoordinates = {
            // offsetLeft donne le nombre de pixels entre la gauche
            // de la boîte de collision et la gauche de l'écran. /)
            x: this.potatoColliderElement.offsetLeft,

            // offsetTop donne le nombre de pixels entre le haut
            // de la boîte de collision et le haut de l'écran. /)
            y: this.potatoColliderElement.offsetTop
        }

        // Quand la souris entre en contact avec le visage (mouseenter),
        // on exécute la méthode faceMouseEnter de l'instance de Potatogochi. /)
        this.potatoFaceElement.addEventListener("mouseenter", () => this.faceMouseEnter());

        // Quand la souris sort du visage (mouseleave), on exécute la
        // méthode faceMouseLeave de l'instance de Potatogochi. /)
        this.potatoFaceElement.addEventListener("mouseleave", () => this.faceMouseLeave());

        // Quand la souris clique sur le visage (click), on exécute la
        // méthode faceClick de l'instance de Potatogochi. /)
        this.potatoFaceElement.addEventListener("click", () => this.faceClick());
    }

    /**
     * Change le visage de la pomme de terre lorsque la souris
     * entre en contact avec le visage. /)
     *
     * @private
     */
    private faceMouseEnter(): void {
        // La pomme de terre ouvre la bouche et les yeux lorsque le
        // curseur entre en contact avec le visage. /)
        this.setFace(Face.MouthOpenEyesOpen);
    }

    /**
     * Change le visage de la pomme de terre lorsque la souris
     * entre en contact avec le visage. /)
     *
     * @private
     */
    private faceMouseLeave(): void {
        // La pomme de terre ferme la bouche et ouvre les yeux lorsque
        // le curseur n'est plus en contact avec le visage. /)
        this.setFace(Face.MouthHappyEyesOpen);
    }

    /**
     * Change le visage de la pomme de terre lorsque la souris
     * clique sur le visage. /)
     *
     * @private
     */
    private faceClick(): void {
        // La pomme de terre ouvre la bouche et ferme les yeux
        // lorsque le curseur clique sur le visage. /)
        this.setFace(Face.MouthOpenEyesClosed);
    }

    /**
     * Change l'orientation de la pomme de terre pour
     * la faire pointer vers le curseur de la souris. /)
     *
     * @private
     */
    private setAngle(): void {
        // Crée une variable angle de type nombre /)
        let angle: number;

        // Si la souris est dans l'écran et qu'on a
        // préalablement calculé les coordonnées pour
        // calculer l'angle. /)
        if (this.mouse && this.angleCoordinates) {
            // On récupère des informations sur la taille et la
            // position de la boîte de collision par rapport à la
            // page. /)
            let boxBoundingRect: DOMRect = this.potatoColliderElement.getBoundingClientRect();

            // On calcule les coordonnées du centre de la boîte de
            // collision. /)
            let boxCenter: Coordinates = {
                x: boxBoundingRect.left + boxBoundingRect.width / 2,
                y: boxBoundingRect.top + boxBoundingRect.height / 2
            }

            // On calcule l'angle à partir des coordonnées calculées
            // précédemment. /)
            angle = Math.atan2(this.angleCoordinates.x - boxCenter.x, - (this.angleCoordinates.y - boxCenter.y)) * (180 / Math.PI);
        } else {
            angle = 0;
        }

        // On change la rotation du jeu pour correspondre à l'angle
        // que l'on vient de calculer. /)
        this.potatoElement.style.transform = "rotate(" + angle + "deg)";
        this.potatoFaceElement.style.transform = "rotate(" + angle + "deg)";
        this.potatoColliderElement.style.transform = "rotate(" + angle + "deg)";
    }

    /**
     * Exécute du code lorsque le curseur de la souris est
     * déplacé. /)
     *
     * @param event - L'événement du movement de la souris
     */
    public mouseMove(event: MouseEvent): void {
        // Si le curseur ne se situe pas sur la boîte de collision /)
        if (event.target !== this.potatoColliderElement) {
            // On redéfinit les coordonnées nous permettant par la
            // suite de calculer l'angle ... /)
            this.angleCoordinates = {
                x: event.pageX,
                y: event.pageY
            }

            // ... et on recalcule l'angle. /)
            this.setAngle();

            // On ne change pas la direction de la pomme de terre
            // lorsque la souris n'est pas sur la boîte de collision. /)
            return;
        }

        // On calcule les coordonnées du curseur de la souris par
        // rapport à la boîte de collision. /)
        let mouseCoordinates: Coordinates = {
            x: event.clientX - this.colliderCoordinates.x,
            y: event.clientY - this.colliderCoordinates.y
        }

        // Par défaut, aucun mouvement ne sera effectué. /)
        this.movementDirection = {
            horizontal: HDirection.None,
            vertical: VDirection.None
        }

        // Si les coordonnées en abscisse sont >250 (droite de la
        // boîte de collision), on va à droite. /)
        if (mouseCoordinates.x > 250) this.movementDirection.horizontal = HDirection.Right;

        // Si les coordonnées en abscisse sont <150 (gauche de la
        // boîte de collision), on va à gauche. /)
        if (mouseCoordinates.x < 150) this.movementDirection.horizontal = HDirection.Left;

        // Si les coordonnées en ordonnée sont >250 (bas de la
        // boîte de collision), on va en bas. /)
        if (mouseCoordinates.y > 250) this.movementDirection.vertical = VDirection.Bottom;

        // Si les coordonnées en ordonnée sont <150 (haut de la
        // boîte de collision), on va en haut. /)
        if (mouseCoordinates.y < 150) this.movementDirection.vertical = VDirection.Top;

        // On redéfinit les coordonnées nous permettant par la
        // suite de calculer l'angle ... /)
        this.angleCoordinates = {
            x: event.pageX,
            y: event.pageY
        }

        // ... et on recalcule l'angle. /)
        this.setAngle();
    }

    /**
     * Change le visage de la pomme de terre lorsque
     * le curseur de la souris entre la fenêtre.
     * Aussi, change la propriété `mouse` pour indiquer
     * que la souris est dans la fenêtre. /)
     */
    public mouseEnter(): void {
        // La pomme de terre est contente et ouvre les yeux lorsque
        // le curseur entre dans la fenêtre. /)
        this.setFace(Face.MouthHappyEyesOpen);

        // On indique à l'instance de Potatogochi que la souris est
        // désormais dans la fenêtre. /)
        this.mouse = true;
    }

    /**
     * Change le visage de la pomme de terre lorsque
     * le curseur de la souris quitte la fenêtre.
     * Aussi, change la propriété `mouse` pour indiquer
     * que la souris n'est plus dans la fenêtre. /)
     */
    public mouseLeave(): void {
        // La pomme de terre est triste et ouvre les yeux lorsque
        // le curseur n'est plus dans la fenêtre. /)
        this.setFace(Face.MouthSadEyesOpen);

        // On indique à l'instance de Potatogochi que la souris n'est
        // désormais plus dans la fenêtre. /)
        this.mouse = false;
    }

    /**
     * Associe un item de Face à un fichier image sur
     * le serveur, ou, si impossible, à l'image par
     * défaut. /)
     *
     * @param face - Un item de Face
     * @private
     */
    private getFaceFile(face: Face): string {
        // Selon la valeur de 'face'... /)
        switch (face) {
            case Face.MouthHappyEyesClosed: // = 0
                return "/assets/face-happy-closed.png";
            case Face.MouthHappyEyesOpen: // = 1
                return "/assets/face-happy-open.png";
            case Face.MouthOpenEyesClosed: // = 2
                return "/assets/face-open-closed.png";
            case Face.MouthOpenEyesOpen: // = 3
                return "/assets/face-open-open.png";
            case Face.MouthSadEyesClosed: // = 4
                return "/assets/face-sad-closed.png";
            case Face.MouthSadEyesOpen: // = 5
                return "/assets/face-sad-open.png";
            default: // < 0 ou > 5
                return "/assets/potato.png";
        }
    }

    /**
     * Change le visage de la pomme de terre à partir
     * d'un item de Face. /)
     *
     * @param face - Face
     * @private
     */
    private setFace(face: Face): void {
        // On change l'URL du fichier que va afficher
        // potatoFaceElement pour le fichier récupéré par
        // la méthode getFaceFile. /)
        this.potatoFaceElement.src = this.getFaceFile(face);
    }

    /**
     * Code exécuté à intervalles réguliers pour faire
     * se déplacer la pomme de terre même sans interaction
     * de la part de l'utilisateur. /)
     */
    public movementEvent(): void {
        // Si la souris ne se trouve pas dans l'écran, la
        // pomme de terre ne doit pas se déplacer. /)
        if (!this.mouse) return;

        // On déplace la pomme de terre en conservant la
        // même direction et en se déplaçant de 10 pixels. /)
        this.movePotato({
            direction: this.movementDirection,
            amount: 10
        });
    }

    /**
     * Déplace la pomme de terre d'un Movement particulier, une seule et
     * unique fois. /)
     *
     * @param movement - Le mouvement que doit effectuer la pomme de terre
     * @private
     */
    private movePotato(movement: Movement): void {
        // Par défaut, les nouvelles coordonnées sont
        // les mêmes que les coordonnées actuelles. /)
        let newCoordinates: Coordinates = {
            // newCoordinates x est donc la position en
            // abscisse actuelle de la pomme de terre. /)
            x: this.potatoElement.offsetLeft,

            // newCoordinates y est donc la position en
            // ordonnée actuelle de la pomme de terre. /)
            y: this.potatoElement.offsetTop

            // Cela permet aussi de recentrer le visage
            // de la pomme de terre par rapport à la
            // pomme de terre elle-même. /)
        }

        // Pareil que pour newCoordinates, excepté qu'on
        // prend à la place les coordonnées du milieu de
        // la pomme de terre /)
        let newColliderCoordinates: Coordinates = {
            x: this.potatoElement.offsetLeft - 128,
            y: this.potatoElement.offsetTop - 128

            // Cela permet aussi de recentrer la boîte
            // de collision par rapport à la pomme de
            // terre. /)
        }

        // Si le mouvement vertical est vers le haut /)
        if (movement.direction.vertical === VDirection.Top) {
            // On ajoute 'amount' aux coordonnées, ce qui va
            // déplacer la pomme de terre de 'amount' pixels
            // vers le haut. /)
            newCoordinates.y = this.potatoElement.offsetTop + movement.amount;

        // Si le mouvement vertical est vers le bas /)
        } else if (movement.direction.vertical === VDirection.Bottom) {
            // On retire 'amount' aux coordonnées, ce qui va
            // déplacer la pomme de terre de 'amount' pixels
            // vers le bas. /)
            newCoordinates.y = this.potatoElement.offsetTop - movement.amount;
        }
        // S'il n'y a pas de mouvement vertical, on ne fait rien /)

        // Si le mouvement horizontal est vers la droite /)
        if (movement.direction.horizontal === HDirection.Left) {
            // On retire 'amount' aux coordonnées, ce qui va
            // déplacer la pomme de terre de 'amount' pixels
            // vers la gauche. /)
            newCoordinates.x = this.potatoElement.offsetLeft + movement.amount;

        // Si le mouvement horizontal est vers la gauche /)
        } else if (movement.direction.horizontal === HDirection.Right) {
            // On retire 'amount' aux coordonnées, ce qui va
            // déplacer la pomme de terre de 'amount' pixels
            // vers la droite. /)
            newCoordinates.x = this.potatoElement.offsetLeft - movement.amount;
        }
        // S'il n'y a pas de mouvement horizontal, on ne fait rien /)

        // Encore une fois, on prend le milieu de la pomme
        // de terre pour la boîte de collision. /)
        newColliderCoordinates.x = newCoordinates.x - 128;
        newColliderCoordinates.y = newCoordinates.y - 128;

        // Si les coordonnées sont plus grandes ou plus petites que
        // la taille de la fenêtre, on les redéfinit pour correspondre
        // à la taille de la fenêtre. /)
        if (newCoordinates.x <= 0) newCoordinates.x = 1;
        if (newCoordinates.x >= this.width) newCoordinates.x = this.width - 1;
        if (newCoordinates.y <= 0) newCoordinates.y = 1;
        if (newCoordinates.y >= this.height) newCoordinates.y = this.height - 1;

        // Pareil pour les coordonnées de la boîte de collision.
        // Cette fois-ci on ne prend pas les coordonnées du milieu
        // pour que la boîte de collision reste centrée par rapport
        // à la pomme de terre. /)
        if (newColliderCoordinates.x <= 0) newColliderCoordinates.x = 1;
        if (newColliderCoordinates.x >= this.width) newColliderCoordinates.x = this.width - 1;
        if (newColliderCoordinates.y <= 0) newColliderCoordinates.y = 1;
        if (newColliderCoordinates.y >= this.height) newColliderCoordinates.y = this.height - 1;

        // On change la position horizontale des éléments (plus
        // exactement le nombre de pixels entre la gauche de
        // l'élément et la gauche de l'écran) pour correspondre à
        // leurs valeurs respectives (de newCoordinates pour la
        // pomme de terre et le visage, et de newColliderCoordinates
        // pour la boîte de collision). /)
        this.potatoElement.style.left = newCoordinates.x + "px";
        this.potatoFaceElement.style.left = newCoordinates.x + "px";
        this.potatoColliderElement.style.left = newColliderCoordinates.x + "px";

        // De même, mais cette fois-ci pour la position verticale
        // (et donc pour le nombre de pixels entre le haut de l'élément
        // et le haut de l'écran). /)
        this.potatoElement.style.top = newCoordinates.y + "px";
        this.potatoFaceElement.style.top = newCoordinates.y + "px";
        this.potatoColliderElement.style.top = newColliderCoordinates.y + "px";

        // On redéfinit les coordonnées nous permettant par la
        // suite de calculer l'angle ... /)
        this.angleCoordinates = {
            // Noter qu'on utilise les coordonnées de la
            // boîte de collision, car il n'y a pas eu de
            // mouvement du curseur de la souris. Nous ne
            // pouvons donc pas utiliser les coordonnées du
            // curseur /)
            x: this.potatoColliderElement.offsetLeft,
            y: this.potatoColliderElement.offsetTop
        }

        // ... et on recalcule l'angle. /)
        this.setAngle();
    }
}

/**
 * Au chargement de la page,
 * - créée une instance de Potatogochi
 * - associe les événements du curseur à leurs méthodes
 * - fait se déplacer la pomme de terre toutes les 100ms
 * /)
 */
window.addEventListener("load", () => {
    // On crée une nouvelle instance de Potatogochi en utilisant
    // les éléments d'ID "potato", "potato-face" et "potato-collider". /)
    const Potatogochi: PotatogochiInstance = new PotatogochiInstance(
        // On utilise l'élément d'ID "potato" comme un HTMLImageElement
        // (c'est-à-dire un <img> dans le DOM) /)
        document.getElementById("potato") as HTMLImageElement,

        // On utilise l'élément d'ID "potato-face" comme un HTMLImageElement
        // (c'est-à-dire un <img> dans le DOM) /)
        document.getElementById("potato-face") as HTMLImageElement,

        // On utilise l'élément d'ID "potato-collider" comme un HTMLDivElement
        // (c'est-à-dire un <div>...</div> dans le DOM) /)
        document.getElementById("potato-collider") as HTMLDivElement
    );

    // Quand la souris se déplace sur l'écran (mousemove), on exécute la méthode
    // mouseMove de l'instance de Potatogochi. /)
    document.body.addEventListener("mousemove", (event: MouseEvent) => { Potatogochi.mouseMove(event); });

    // Quand la souris sort de l'écran (mouseleave), on exécute la méthode
    // mouseLeave de l'instance de Potatogochi. /)
    document.body.addEventListener("mouseleave", () => { Potatogochi.mouseLeave(); });

    // Quand la souris entre dans l'écran (mouseenter), on exécute la méthode
    // mouseEnter de l'instance de Potatogochi. /)
    document.body.addEventListener("mouseenter", () => { Potatogochi.mouseEnter(); });

    // Toutes les 100 millisecondes, on exécute la méthode movementEvent
    // de l'instance de Potatogochi. /)
    setInterval(() => {
        Potatogochi.movementEvent();
    }, 100);
});
