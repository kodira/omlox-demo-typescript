{
  description = "Development environment for intrusion-alarm Angular app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            nodePackages.npm
            chromium
          ];

          shellHook = ''
            export CHROME_BIN="${pkgs.chromium}/bin/chromium"
            echo "Angular development environment"
            echo "Node: $(node --version)"
            echo "npm: $(npm --version)"
            echo ""
            if [ ! -d "node_modules" ]; then
              echo "Installing dependencies..."
              npm install
            fi
            echo ""
            echo "Available commands:"
            echo "  npm start     - Start development server"
            echo "  npm run build - Build the project"
            echo "  npm test      - Run unit tests"
          '';
        };
      }
    );
}
